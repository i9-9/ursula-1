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

// Función para subir una imagen específica
async function uploadSingleThumbnail(fileName, projectName) {
  try {
    console.log(`🚀 Subiendo: ${fileName} para proyecto: ${projectName}`);
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Buscar el proyecto
    const entries = await environment.getEntries({
      content_type: 'archiveItem',
      'fields.project': projectName,
      limit: 1
    });
    
    if (entries.items.length === 0) {
      console.log(`❌ No se encontró el proyecto: ${projectName}`);
      return;
    }
    
    const entry = entries.items[0];
    console.log(`✅ Proyecto encontrado: ${entry.fields.project['en-US']}`);
    
    // Verificar si ya tiene thumbnail
    if (entry.fields.thumbnail && entry.fields.thumbnail['en-US']) {
      console.log(`⏭️  El proyecto ya tiene thumbnail, saltando...`);
      return;
    }
    
    // Leer el archivo
    const filePath = path.join('./imagenes_subida', fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      return;
    }
    
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
    console.log('⚙️  Procesando asset...');
    const processedAsset = await asset.processForAllLocales();
    
    // Publicar el asset
    console.log('📤 Publicando asset...');
    const publishedAsset = await processedAsset.publish();
    console.log(`✅ Asset creado: ${publishedAsset.sys.id}`);
    
    // Asignar el thumbnail a la entrada
    console.log('🔗 Asignando thumbnail a la entrada...');
    entry.fields.thumbnail = {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: publishedAsset.sys.id
        }
      }
    };
    
    // Actualizar la entrada
    const updatedEntry = await entry.update();
    await updatedEntry.publish();
    
    console.log(`🎉 ¡Thumbnail asignado exitosamente a: "${projectName}"!`);
    console.log(`🌟 URL del asset: https://images.ctfassets.net/${SPACE_ID}/${publishedAsset.sys.id}/${fileName}`);
    
  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }
}

// Verificar argumentos
const fileName = process.argv[2];
const projectName = process.argv[3];

if (!fileName || !projectName) {
  console.log('Uso: node upload-single-thumbnail.js <nombre-archivo> <nombre-proyecto>');
  console.log('Ejemplo: node upload-single-thumbnail.js "PERSONAL - PERSONAL FLOW.png" "PERSONAL - PERSONAL FLOW"');
  process.exit(1);
}

uploadSingleThumbnail(fileName, projectName); 