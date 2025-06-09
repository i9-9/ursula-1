/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function updateSectionTitle() {
  try {
    console.log('🔄 ACTUALIZANDO TÍTULO DE SECCIÓN');
    console.log('=================================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Buscar la sección "MUSIC VIDEO"
    const sectionsResponse = await environment.getEntries({
      content_type: 'archiveSection',
      'fields.title': 'MUSIC VIDEO',
      limit: 1
    });
    
    if (sectionsResponse.items.length === 0) {
      console.log('❌ No se encontró la sección "MUSIC VIDEO"');
      return;
    }
    
    const musicVideoSection = sectionsResponse.items[0];
    console.log(`✅ Sección encontrada: "${musicVideoSection.fields.title['en-US']}"`);
    console.log(`📦 Items en la sección: ${musicVideoSection.fields.items ? musicVideoSection.fields.items['en-US'].length : 0}`);
    
    // Actualizar el título
    musicVideoSection.fields.title['en-US'] = 'MUSIC VIDEOS';
    
    console.log('🔄 Actualizando título...');
    const updatedSection = await musicVideoSection.update();
    
    console.log('📝 Publicando cambios...');
    await updatedSection.publish();
    
    console.log('\n🎉 TÍTULO ACTUALIZADO EXITOSAMENTE');
    console.log('===================================');
    console.log('✅ "MUSIC VIDEO" → "MUSIC VIDEOS"');
    console.log('🌟 Los cambios ya están disponibles en tu aplicación!');
    
  } catch (error) {
    console.error('❌ Error actualizando título de sección:', error);
  }
}

updateSectionTitle(); 