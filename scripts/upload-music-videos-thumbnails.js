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
const IMAGES_FOLDER = './videoclip';

// Mapeo de nombres de archivos a nombres de proyectos en Contentful para MUSIC VIDEOS
const nameMapping = {
  // MUSIC VIDEOS que necesitan thumbnails
  'ALOE - CUANDO SERA.png': 'ALOE - CUANDO SERA',
  'CONOCIENDO RUSIA - COSAS PARA DECIRTE.png': 'CONOCIENDO RUSIA - COSAS PARA DECIRTE',
  'DUKI - ANTES DE PERDERTE.png': 'DUKI - ANTES DE PERDERTE',
  'duki antes de perderte.png': 'DUKI - ANTES DE PERDERTE',
  'DILLOM PELOTUDA.png': 'DILLOM - PELOTUDA',
  'LOUTA NO ME ESTAS HACIENDO UN FAVOR.png': 'LOUTA - NO ME ESTAS HACIENDO UN FAVOR',
  'MARIA BECERRA OJALA.png': 'MARIA BECERRA - OJALA',
  'maria becerra TE ESPERO.png': 'MARIA BECERRA & PRINCE ROYCE - TE ESPERO',
  'JULIETA VENEGAS en tu orilla, 2023.png': 'JULIETA VENEGAS - EN TU ORILLA',
  'julieta venegas en tu orilla.png': 'JULIETA VENEGAS - EN TU ORILLA',
  'JULIETA VENEGAS en tu orilla, 2023 II.png': 'JULIETA VENEGAS - EN TU ORILLA',
  'JULIETA VENEGAS - MISMO AMOR.png': 'JULIETA VENEGAS - MISMO AMOR',
  'JULIETA VENEGAS MISMO AMOR.png': 'JULIETA VENEGAS - MISMO AMOR',
  
  // MUSIC VIDEOS que ya tienen thumbnails pero podemos mejorar
  'DUKI SI QUIEREN FRONTEAR.png': 'DUKI & DE LA GHETTO & QUEVEDO - SI QUIEREN FRONTEAR',
  'DUKI FT LA GHETTO FT QUEVEDO - SI QUIEREN FRONTEAR.png': 'DUKI & DE LA GHETTO & QUEVEDO - SI QUIEREN FRONTEAR',
  'DUKI - SI QUIEREN FRONTEAR .png': 'DUKI & DE LA GHETTO & QUEVEDO - SI QUIEREN FRONTEAR',
  'MARIA BECERRA - AUTOMATICO.png': 'MARIA BECERRA - AUTOMATICO',
  'MARIA BECERRA AUTOMATICO.png': 'MARIA BECERRA - AUTOMATICO',
  'MARIA BECERRA - IMAN.png': 'MARIA BECERRA - IMAN',
  'maria becerra iman.png': 'MARIA BECERRA - IMAN',
  'MARIA BECERRA - PRIMER AVISO.png': 'MARIA BECERRA - PRIMER AVISO',
  'maria becerra primer aviso.png': 'MARIA BECERRA - PRIMER AVISO',
  'MARIA BECERRA corazon vacio, 2023.png': 'MARIA BECERRA - CORAZON VACIO',
  'MARIA BECERRA CORAZON VACIO.png': 'MARIA BECERRA - CORAZON VACIO',
  'CONOCIENDO RUSIA Y NATALIA LAFOURCADE 5 horas  2023.png': 'CONOCIENDO RUSIA & NATALIA LAFOURCADE - CINCO HORAS MENOS',
  'conociendo rusia - cinco horas menos.png': 'CONOCIENDO RUSIA & NATALIA LAFOURCADE - CINCO HORAS MENOS',
  'SARAMALACARA - MAS FELIZ.png': 'SARAMALACARA - MAS FELIZ',
  'TAICHU ft LALI - S.O.S.jpg': 'TAICHU FT. LALI - S.O.S',
  
  // Proyectos adicionales encontrados
  'CHITA - SOLA.png': 'CHITA - SOLA',
  'DILLOM - BUENOS TIEMPOS.png': 'DILLOM - BUENOS TIEMPOS',
  'DILLOM BUENOS TIEMPOS.png': 'DILLOM - BUENOS TIEMPOS',
  'DILLOM - CIRUGIA.png': 'DILOM - CIRUGIA',
  'DILLOM CIRUGIA.png': 'DILOM - CIRUGIA',
  'MILO J - 3PD.jpg': 'MILO J - TRES PECADOS DESPUES',
  'MILO J ali oli , 2024.jpg': 'MILO J - ALI OLI',
  'SWAGGERBOYZ ft DILLOM - el morocho, el rubio y el colo , 2024 .jpg': 'SWAGGERBOYS & DILLOM - EL MOROCHO, EL RUBIO Y EL COLO',
  'blair.png': 'BLAIR - BAR SCORPIOS',
  'BLAIR(1).png': 'BLAIR - BAR SCORPIOS',
  'BLAIR ft DILLOM - CARNE.png': 'BLAIR - BAR SCORPIOS',
  'SEBASTIAN YATRA - PELIRROJA.png': 'SEBASTIAN YATRA - LA PELIROJA',
  'YATRA - DISCO RAYADO.png': 'SEBASTIAN YATRA - TEMPLO DE PICEAS',
  'templo de piceas.png': 'SEBASTIAN YATRA - TEMPLO DE PICEAS'
};

function normalizeProjectName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s*&\s*/g, ' & ')
    .replace(/\s*ft\.?\s*/g, ' ft. ');
}

function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.webp': return 'image/webp';
    default: return 'image/png';
  }
}

async function uploadMusicVideosThumbnails() {
  try {
    console.log('🎵 SUBIDA DE THUMBNAILS - MUSIC VIDEOS');
    console.log('=====================================');
    
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
    
    console.log(`📷 Imágenes de MUSIC VIDEOS encontradas: ${imageFiles.length}`);
    console.log(`🎯 Mapeos definidos: ${Object.keys(nameMapping).length}`);
    
    let uploadedCount = 0;
    let assignedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const fileName of imageFiles) {
      try {
        console.log(`\n🎵 Procesando: ${fileName}`);
        
        // Obtener el nombre del proyecto correspondiente
        const projectName = nameMapping[fileName];
        if (!projectName) {
          console.log(`⚠️  No hay mapeo definido para: "${fileName}"`);
          skippedCount++;
          continue;
        }
        
        const normalizedProjectName = normalizeProjectName(projectName);
        
        console.log(`🔍 Buscando proyecto: "${projectName}"`);
        console.log(`🔍 Normalizado: "${normalizedProjectName}"`);
        
        // Buscar la entrada correspondiente
        const entryData = entriesMap.get(normalizedProjectName);
        if (!entryData) {
          console.log(`⚠️  No se encontró entrada para: "${projectName}"`);
          console.log(`💡 Sugerencias (proyectos similares):`);
          
          // Buscar proyectos similares
          const searchTerms = projectName.toLowerCase().split(' ').slice(0, 2);
          const similarProjects = [];
          for (const [key, value] of entriesMap) {
            if (searchTerms.some(term => key.includes(term))) {
              similarProjects.push(value.originalName);
            }
          }
          
          if (similarProjects.length > 0) {
            similarProjects.slice(0, 3).forEach(proj => {
              console.log(`   • "${proj}"`);
            });
          }
          
          skippedCount++;
          continue;
        }
        
        console.log(`✅ Entrada encontrada: "${entryData.originalName}"`);
        
        // Verificar si ya tiene thumbnail (opcional - comentado para permitir reemplazos)
        const currentThumbnail = entryData.item.fields.thumbnail;
        if (currentThumbnail && currentThumbnail['en-US']) {
          console.log(`🔄 Ya tiene thumbnail, reemplazando...`);
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
              'en-US': `${projectName} - MUSIC VIDEO Thumbnail`
            },
            description: {
              'en-US': `Thumbnail de MUSIC VIDEO para ${projectName}`
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
          errorCount++;
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
        errorCount++;
      }
    }
    
    // RESUMEN FINAL
    console.log('\n🎉 SUBIDA DE MUSIC VIDEOS COMPLETADA');
    console.log('====================================');
    console.log(`📤 Assets subidos: ${uploadedCount}/${imageFiles.length}`);
    console.log(`🔗 Thumbnails asignados: ${assignedCount}/${imageFiles.length}`);
    console.log(`⏭️  Archivos saltados: ${skippedCount}/${imageFiles.length}`);
    console.log(`❌ Errores: ${errorCount}/${imageFiles.length}`);
    console.log('✅ ¡Proceso completado!');
    
    if (assignedCount > 0) {
      console.log('\n🌟 Las imágenes de MUSIC VIDEOS están ahora disponibles!');
      console.log('🔗 Recarga http://localhost:3002 para verlas en los tooltips');
      console.log('🌐 El webhook debería actualizar la producción automáticamente');
    }
    
  } catch (error) {
    console.error('❌ Error en subida de thumbnails MUSIC VIDEOS:', error);
    if (error.response && error.response.data) {
      console.error('Detalles del error:', error.response.data);
    }
  }
}

uploadMusicVideosThumbnails(); 