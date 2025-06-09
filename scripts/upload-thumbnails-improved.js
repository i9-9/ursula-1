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
  'HILERET - ES NATURAL.png': 'HILERET - ES NATURAL',
  'LOLLAPALOZA - 10 AÑOS - PUNK.png': 'LOLLAPALOZA - 10 AÑOS - PUNK',
  'LOLLAPALOZA - 10 AÑOS - VERBORRAGIA.png': 'LOLLAPALOZA - 10 AÑOS - VERBORRAGIA',
  'MACMA - BREAST CANCER CAMPAIGN.png': 'MACMA - BREAST CANCER CAMPAIGN',
  'QUILMES - QUILMES ROCK.png': 'QUILMES - QUILMES ROCK',
  'STELLA ARTOIS - STELLA ARTOIS.png': 'STELLA ARTOIS - STELLA ARTOIS'
};

async function uploadThumbnails() {
  try {
    console.log('🚀 Iniciando subida de thumbnails...\n');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Verificar que la carpeta existe
    if (!fs.existsSync(IMAGES_FOLDER)) {
      console.log(`❌ Error: La carpeta ${IMAGES_FOLDER} no existe`);
      return;
    }
    
    // Leer archivos de la carpeta
    const files = fs.readdirSync(IMAGES_FOLDER).filter(file => 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg')
    );
    
    console.log(`📁 Archivos encontrados: ${files.length}`);
    files.forEach(file => console.log(`   - ${file}`));
    console.log('');
    
    // Obtener todas las entradas del archive
    const archiveEntries = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`📊 Entradas de archive encontradas: ${archiveEntries.items.length}\n`);
    
    let uploadedCount = 0;
    let assignedCount = 0;
    
    for (const file of files) {
      try {
        console.log(`🔄 Procesando: ${file}`);
        
        // Buscar el nombre del proyecto correspondiente
        const projectName = nameMapping[file];
        if (!projectName) {
          console.log(`   ⚠️  No se encontró mapeo para ${file}`);
          continue;
        }
        
        // Buscar la entrada correspondiente en Contentful
        const matchingEntry = archiveEntries.items.find(entry => 
          entry.fields.project && 
          entry.fields.project['en-US'] === projectName
        );
        
        if (!matchingEntry) {
          console.log(`   ❌ No se encontró entrada para: ${projectName}`);
          continue;
        }
        
        console.log(`   ✅ Entrada encontrada: ${projectName}`);
        
        // Verificar si ya tiene thumbnail
        if (matchingEntry.fields.thumbnail && matchingEntry.fields.thumbnail['en-US']) {
          console.log(`   ⚠️  Ya tiene thumbnail asignado`);
          continue;
        }
        
        // Leer el archivo
        const filePath = path.join(IMAGES_FOLDER, file);
        const fileBuffer = fs.readFileSync(filePath);
        
        console.log(`   📤 Subiendo asset...`);
        
        // Crear el asset
        const asset = await environment.createAsset({
          fields: {
            title: {
              'en-US': `Thumbnail - ${projectName}`
            },
            file: {
              'en-US': {
                contentType: file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
                fileName: file,
                file: fileBuffer
              }
            }
          }
        });
        
        // Procesar el asset
        await asset.processForAllLocales();
        console.log(`   ⏳ Procesando asset...`);
        
        // Esperar a que se procese
        let processed = false;
        let attempts = 0;
        while (!processed && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const updatedAsset = await environment.getAsset(asset.sys.id);
          if (updatedAsset.fields.file['en-US'].url) {
            processed = true;
            console.log(`   ✅ Asset procesado: ${updatedAsset.fields.file['en-US'].url}`);
          }
          attempts++;
        }
        
        if (!processed) {
          console.log(`   ❌ Error: Asset no se procesó correctamente`);
          continue;
        }
        
        // Publicar el asset
        const publishedAsset = await asset.publish();
        uploadedCount++;
        
        console.log(`   📝 Asignando thumbnail a la entrada...`);
        
        // Asignar el asset a la entrada
        matchingEntry.fields.thumbnail = {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: publishedAsset.sys.id
            }
          }
        };
        
        // Actualizar la entrada
        const updatedEntry = await matchingEntry.update();
        await updatedEntry.publish();
        assignedCount++;
        
        console.log(`   🎉 ¡Thumbnail asignado exitosamente!\n`);
        
      } catch (error) {
        console.log(`   ❌ Error procesando ${file}:`, error.message);
      }
    }
    
    console.log('🎉 SUBIDA DE THUMBNAILS COMPLETADA');
    console.log('===================================');
    console.log(`📤 Assets subidos: ${uploadedCount}/${files.length}`);
    console.log(`🔗 Thumbnails asignados: ${assignedCount}/${files.length}`);
    console.log('✅ ¡Proceso completado!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

uploadThumbnails(); 