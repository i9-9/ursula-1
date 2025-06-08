/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function addVideoFields() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener el content type archiveItem
    const contentType = await environment.getContentType('archiveItem');
    
    console.log('📋 Campos actuales en archiveItem:');
    contentType.fields.forEach(field => {
      console.log(`  - ${field.id}: ${field.name} (${field.type})`);
    });
    
    // Verificar si los campos ya existen
    const hasVimeoId = contentType.fields.some(field => field.id === 'vimeoId');
    const hasVideoUrl = contentType.fields.some(field => field.id === 'videoUrl');
    
    if (hasVimeoId && hasVideoUrl) {
      console.log('✅ Los campos de video ya existen en el modelo');
      return;
    }
    
    let fieldsAdded = [];
    
    // Agregar campo vimeoId si no existe
    if (!hasVimeoId) {
      contentType.fields.push({
        id: 'vimeoId',
        name: 'Vimeo ID',
        type: 'Symbol',
        localized: false,
        required: false,
        disabled: false,
        omitted: false,
        validations: [],
        defaultValue: {
          'en-US': ''
        }
      });
      fieldsAdded.push('vimeoId');
    }
    
    // Agregar campo videoUrl si no existe
    if (!hasVideoUrl) {
      contentType.fields.push({
        id: 'videoUrl',
        name: 'Video URL',
        type: 'Symbol',
        localized: false,
        required: false,
        disabled: false,
        omitted: false,
        validations: [],
        defaultValue: {
          'en-US': ''
        }
      });
      fieldsAdded.push('videoUrl');
    }
    
    if (fieldsAdded.length > 0) {
      console.log(`➕ Agregando campos: ${fieldsAdded.join(', ')}`);
      
      // Actualizar el content type
      const updatedContentType = await contentType.update();
      
      // Publicar los cambios
      await updatedContentType.publish();
      
      console.log('✅ Content type actualizado y publicado');
      console.log(`📋 Campos agregados: ${fieldsAdded.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Error actualizando content type:', error);
  }
}

addVideoFields(); 