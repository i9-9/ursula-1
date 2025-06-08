/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// IDs de Vimeo de ejemplo para probar (reemplazar con los reales)
const SAMPLE_VIMEO_IDS = {
  'DUKI  - ANTES DE PERDERTE': '123456789',
  'MARIA BECERRA - AUTOMATICO': '987654321',
  'CHITA  - SOLA': '456789123',
  'MILO J - ALI OLI  ': '789123456',
  'DILLOM  - BUENOS TIEMPOS': '321654987',
  'MARIA BECERRA - PRIMER AVISO': '111222333',
  'MARIA BECERRA - IMAN': '444555666',
  'DUKI & DE LA GHETTO & QUEVEDO - SI QUIEREN FRONTEAR': '777888999'
};

async function addSampleVimeoIds() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todos los archiveItems
    const archiveItems = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`📋 Total de items: ${archiveItems.items.length}`);
    
    let updatedCount = 0;
    
    for (const item of archiveItems.items) {
      const project = item.fields.project?.['en-US'] || '';
      const vimeoId = SAMPLE_VIMEO_IDS[project];
      
      if (vimeoId) {
        try {
          console.log(`➕ Agregando Vimeo ID a: ${project}`);
          
          // Actualizar el item con el Vimeo ID
          item.fields.vimeoId = { 'en-US': vimeoId };
          
          const updatedItem = await item.update();
          await updatedItem.publish();
          
          console.log(`✅ Actualizado: ${project} -> Vimeo ID: ${vimeoId}`);
          updatedCount++;
          
        } catch (error) {
          console.error(`❌ Error actualizando ${project}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Proceso completado!`);
    console.log(`📊 Items actualizados: ${updatedCount}/${archiveItems.items.length}`);
    
    if (updatedCount > 0) {
      console.log(`\n📋 IDs de Vimeo agregados a:`);
      Object.entries(SAMPLE_VIMEO_IDS).forEach(([project, vimeoId]) => {
        console.log(`  - ${project}: ${vimeoId}`);
      });
      
      console.log(`\n💡 NOTA: Estos son IDs de ejemplo. Reemplázalos con los IDs reales de Vimeo de tus videos.`);
      console.log(`💡 Para obtener el ID de Vimeo: https://vimeo.com/VIDEO_ID -> usa solo la parte numérica`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addSampleVimeoIds(); 