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
const IMAGES_FOLDER = './imagenes_subida';

// Mapeo de nombres de archivos a nombres de proyectos en Contentful
const nameMapping = {
  'PERSONAL - PERSONAL FLOW.png': 'PERSONAL - PERSONAL FLOW',
  'BETWARRIOR - CASINO&DEPORTE.png': 'BETWARRIOR - DEPORTE&CASINO',
  'HILERET - ES NATURAL QUE DISFRUTES.png': 'HILERET - ES NATURAL QUE DISFRUTES',
  'MERCADOLIBRE - BZRP X NEW ERA.png': 'MERCADOLIBRE - BZRP X NEW ERA',
  'SPOTIFY - MARIA BECERRA.png': 'SPOTIFY - MARIA BECERRA',
  'SPOTIFY ARGENTINA - SPOTIFY SINGLES.png': 'SPOTIFY - SPOTIFY SINGLES ARGENTINA',
  'BONAFONT - KILOMETROS QUE NOS MUEVEN.png': 'BONAFONT MEXICO - KILOMETROS QUE NOS MUEVEN',
  'CERVEZA QUILMES - SON OTROS TIEMPOS.png': 'CERVEZA QUILMES - SON OTROS TIEMPOS'
};

function normalizeProjectName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, ' - ');
}

async function uploadThumbnails() {
  try {
    console.log('🖼️  SUBIDA DE THUMBNAILS INICIADA');
    console.log('==================================');
    
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
    
    console.log(`📷 Imágenes encontradas: ${imageFiles.length}`);
    imageFiles.forEach(file => {
      console.log(`  • ${file}`);
    });
    
    let uploadedCount = 0;
    let assignedCount = 0;
    
    for (const fileName of imageFiles) {
      try {
        console.log(`\n📤 Procesando: ${fileName}`);
        
        // Obtener el nombre del proyecto correspondiente
        const projectName = nameMapping[fileName] || fileName.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '');
        const normalizedProjectName = normalizeProjectName(projectName);
        
        console.log(`🔍 Buscando proyecto: "${projectName}"`);
        
        // Buscar la entrada correspondiente
        const entryData = entriesMap.get(normalizedProjectName);
        if (!entryData) {
          console.log(`⚠️  No se encontró entrada para: "${projectName}"`);
          continue;
        }
        
        console.log(`✅ Entrada encontrada: "${entryData.originalName}"`);
        
        // Verificar si ya tiene thumbnail
        const currentThumbnail = entryData.item.fields.thumbnail;
        if (currentThumbnail && currentThumbnail['en-US']) {
          console.log(`⏭️  Ya tiene thumbnail, saltando...`);
          continue;
        }
        
        // Leer el archivo
        const filePath = path.join(IMAGES_FOLDER, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        const fileStats = fs.statSync(filePath);
        
        console.log(`📁 Tamaño: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
        
        // Crear asset en Contentful
        console.log('🚀 Subiendo a Contentful...');
        const asset = await environment.createAsset({
          fields: {
            title: {
              'en-US': `${projectName} - Thumbnail`
            },
            description: {
              'en-US': `Thumbnail para ${projectName}`
            },
            file: {
              'en-US': {
                contentType: `image/${path.extname(fileName).slice(1).toLowerCase()}`,
                fileName: fileName,
                upload: fileBuffer
              }
            }
          }
        });
        
        // Procesar el asset
        const processedAsset = await asset.processForAllLocales();
        
        // Publicar el asset
        const publishedAsset = await processedAsset.publish();
        console.log(`✅ Asset creado: ${publishedAsset.sys.id}`);
        uploadedCount++;
        
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
        
      } catch (error) {
        console.error(`❌ Error procesando "${fileName}":`, error.message);
      }
    }
    
    // RESUMEN FINAL
    console.log('\n🎉 SUBIDA DE THUMBNAILS COMPLETADA');
    console.log('===================================');
    console.log(`📤 Assets subidos: ${uploadedCount}/${imageFiles.length}`);
    console.log(`🔗 Thumbnails asignados: ${assignedCount}/${imageFiles.length}`);
    console.log('✅ ¡Proceso completado!');
    
    if (assignedCount > 0) {
      console.log('\n🌟 Las imágenes ya están disponibles en tu aplicación!');
      console.log('🔗 Visita http://localhost:3001 para verlas');
    }
    
  } catch (error) {
    console.error('❌ Error en subida de thumbnails:', error);
  }
}

uploadThumbnails(); 