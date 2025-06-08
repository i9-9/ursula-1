/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function checkStructure() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener archiveSections
    const sections = await environment.getEntries({
      content_type: 'archiveSection',
      limit: 1000
    });
    
    // Obtener archiveItems
    const items = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log('📂 ESTRUCTURA ACTUAL DEL ARCHIVO:');
    console.log('==================================');
    
    console.log(`\n📊 Secciones: ${sections.items.length}`);
    console.log(`📊 Items totales: ${items.items.length}`);
    
    // Mostrar secciones y sus items
    sections.items.forEach(section => {
      const title = section.fields.title ? section.fields.title['en-US'] : 'Sin título';
      const order = section.fields.order ? section.fields.order['en-US'] : 'Sin orden';
      const itemRefs = section.fields.items ? section.fields.items['en-US'] : [];
      
      console.log(`\n📂 ${title} (Orden: ${order})`);
      console.log(`   📋 Items referenciados: ${itemRefs.length}`);
      
      // Mostrar los items de esta sección
      itemRefs.forEach((itemRef, index) => {
        const itemId = itemRef.sys.id;
        const item = items.items.find(i => i.sys.id === itemId);
        
        if (item) {
          const project = item.fields.project ? item.fields.project['en-US'] : 'Sin nombre';
          const year = item.fields.year ? item.fields.year['en-US'] : '';
          const company = item.fields.company ? item.fields.company['en-US'] : '';
          
          console.log(`   ${index + 1}. ${project} (${year}) - ${company}`);
        } else {
          console.log(`   ${index + 1}. ❌ Item no encontrado: ${itemId}`);
        }
      });
    });
    
    // Mostrar campos del modelo archiveItem
    console.log('\n🔧 ESTRUCTURA DEL MODELO archiveItem:');
    const contentType = await environment.getContentType('archiveItem');
    contentType.fields.forEach(field => {
      console.log(`  - ${field.id}: ${field.name} (${field.type})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkStructure(); 