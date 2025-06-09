/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';
const IMAGES_FOLDER = './set design';

// Mapeo de nombres de archivos a nombres de proyectos en Contentful para SET DESIGN
const nameMapping = {
  'RIES EDITORIAL.png': 'RIES - EDITORIAL',
  'PUMA MOSTRO.JPG': 'PUMA - FASHION WEEK',
  'LUNA ALVAREZ CASTILLO - POP UP .JPG': 'LUNA ALVAREZ CASTILLO - LOCAL',
  'JAZMIN CHEBAR - ACCESORIOS 2025.jpg': 'JAZMIN CHEBAR - ACCESORIOS INVIERNO',
  'MARIA BECERRA LOLLAPALOZA.jpeg': 'MARIA BECERRA - LOLLAPALOZA SHOW',
  'SHOW FLORIAN.JPG': 'SHOW FLORIAN' // Este parece ser un proyecto extra
};

function normalizeProjectName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, ' - ');
}

function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.webp': return 'image/webp';
    default: return 'image/jpeg';
  }
}

async function uploadSetDesignThumbnails() {
  try {
    console.log('🖼️  SUBIDA DE THUMBNAILS - SET DESIGN');
    console.log('====================================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas del archive
    const itemsResponse = await environment.getEntries({ 
      content_type: 'archiveItem', 
      limit: 1000 
    });
    
    console.log(`📊 Entradas encontradas: ${itemsResponse.items.length}`);
    
    // Crear mapa de entradas por nombre normalizado
    const entriesMap = new Map();
    itemsResponse.items.forEach(item => {
      const project = item.fields.project ? item.fields.project['en-US'] : '';
      const normalizedName = normalizeProjectName(project);
      entriesMap.set(normalizedName, { item, originalName: project });
    });
    
    // Obtener lista de imágenes
    const imageFiles = fs.readdirSync(IMAGES_FOLDER)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
    
    console.log(`📷 Imágenes de SET DESIGN encontradas: ${imageFiles.length}`);
    imageFiles.forEach(file => {
      console.log(`  • ${file}`);
    });
    
    let uploadedCount = 0;
    let assignedCount = 0;
    let skippedCount = 0;
    
    for (const fileName of imageFiles) {
      try {
        console.log(`\n📤 Procesando: ${fileName}`);
        
        // Obtener el nombre del proyecto correspondiente
        const projectName = nameMapping[fileName];
        if (!projectName) {
          console.log(`⚠️  No hay mapeo definido para: "${fileName}"`);
          skippedCount++;
          continue;
        }
        
        const normalizedProjectName = normalizeProjectName(projectName);
        
        console.log(`🔍 Buscando proyecto: "${projectName}"`);
        
        // Buscar la entrada correspondiente
        const entryData = entriesMap.get(normalizedProjectName);
        if (!entryData) {
          console.log(`⚠️  No se encontró entrada para: "${projectName}"`);
          console.log(`💡 Proyectos SET DESIGN disponibles:`);
          const setDesignProjects = itemsResponse.items.filter(item => {
            const project = item.fields.project ? item.fields.project['en-US'] : '';
            return ['RIES', 'PUMA', 'LUNA', 'JAZMIN', 'MARIA BECERRA', 'FLORIAN'].some(keyword => 
              project.toUpperCase().includes(keyword)
            );
          });
          setDesignProjects.forEach(item => {
            console.log(`   • "${item.fields.project['en-US']}"`);
          });
          skippedCount++;
          continue;
        }
        
        console.log(`✅ Entrada encontrada: "${entryData.originalName}"`);
        
        // Verificar si ya tiene thumbnail
        const currentThumbnail = entryData.item.fields.thumbnail;
        if (currentThumbnail && currentThumbnail['en-US']) {
          console.log(`⏭️  Ya tiene thumbnail, saltando...`);
          skippedCount++;
          continue;
        }
        
        // Leer el archivo
        const filePath = path.join(IMAGES_FOLDER, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        const fileStats = fs.statSync(filePath);
        const contentType = getMimeType(fileName);
        
        console.log(`📁 Tamaño: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📄 Tipo: ${contentType}`);
        
        // MÉTODO CORRECTO: Crear upload primero
        console.log('🚀 Creando upload...');
        const upload = await environment.createUpload({
          file: fileBuffer,
          contentType: contentType,
        });
        
        console.log(`✅ Upload creado: ${upload.sys.id}`);
        
        // Crear asset usando el upload
        console.log('📄 Creando asset...');
        const asset = await environment.createAsset({
          fields: {
            title: {
              'en-US': `${projectName} - SET DESIGN Thumbnail`
            },
            description: {
              'en-US': `Thumbnail de SET DESIGN para ${projectName}`
            },
            file: {
              'en-US': {
                contentType: contentType,
                fileName: fileName,
                uploadFrom: {
                  sys: {
                    type: 'Link',
                    linkType: 'Upload',
                    id: upload.sys.id
                  }
                }
              }
            }
          }
        });
        
        console.log(`📄 Asset creado: ${asset.sys.id}`);
        
        // Procesar el asset
        console.log('⚙️  Procesando asset...');
        await asset.processForAllLocales();
        
        // Esperar a que se procese completamente
        let processedAsset = await environment.getAsset(asset.sys.id);
        let attempts = 0;
        while (!processedAsset.fields.file['en-US'].url && attempts < 15) {
          console.log(`   ⏳ Esperando procesamiento... (intento ${attempts + 1}/15)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          processedAsset = await environment.getAsset(asset.sys.id);
          attempts++;
        }
        
        if (!processedAsset.fields.file['en-US'].url) {
          console.log(`❌ Error: Asset no se procesó correctamente después de ${attempts} intentos`);
          continue;
        }
        
        console.log(`✅ Asset procesado: ${processedAsset.fields.file['en-US'].url}`);
        
        // Publicar el asset
        console.log('📤 Publicando asset...');
        const publishedAsset = await processedAsset.publish();
        uploadedCount++;
        
        console.log(`✅ Asset publicado: ${publishedAsset.sys.id}`);
        
        // Asignar el thumbnail a la entrada
        console.log('🔗 Asignando thumbnail a la entrada...');
        entryData.item.fields.thumbnail = {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: publishedAsset.sys.id
            }
          }
        };
        
        // Actualizar la entrada
        const updatedItem = await entryData.item.update();
        await updatedItem.publish();
        
        console.log(`✅ Thumbnail asignado a: "${entryData.originalName}"`);
        assignedCount++;
        
        // Pausa entre uploads para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error procesando "${fileName}":`, error.message);
        if (error.response && error.response.data) {
          console.error(`   Detalles del error:`, error.response.data);
        }
      }
    }
    
    // RESUMEN FINAL
    console.log('\n🎉 SUBIDA DE SET DESIGN COMPLETADA');
    console.log('==================================');
    console.log(`📤 Assets subidos: ${uploadedCount}/${imageFiles.length}`);
    console.log(`🔗 Thumbnails asignados: ${assignedCount}/${imageFiles.length}`);
    console.log(`⏭️  Archivos saltados: ${skippedCount}/${imageFiles.length}`);
    console.log('✅ ¡Proceso completado!');
    
    if (assignedCount > 0) {
      console.log('\n🌟 Las imágenes de SET DESIGN están ahora disponibles!');
      console.log('🔗 Recarga http://localhost:3002 para verlas en los tooltips');
    }
    
  } catch (error) {
    console.error('❌ Error en subida de thumbnails SET DESIGN:', error);
    if (error.response && error.response.data) {
      console.error('Detalles del error:', error.response.data);
    }
  }
}

uploadSetDesignThumbnails(); 