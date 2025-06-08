/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function fixBrokenReferences() {
  console.log('🔧 Fixing broken references in archive sections...');
  
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas actuales
    const archiveItems = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    const archiveSections = await environment.getEntries({
      content_type: 'archiveSection',
      limit: 1000
    });
    
    console.log(`📊 Found ${archiveItems.items.length} archive items`);
    console.log(`📊 Found ${archiveSections.items.length} archive sections`);
    
    // Crear set de IDs válidos
    const validItemIds = new Set(archiveItems.items.map(item => item.sys.id));
    console.log('✅ Valid item IDs:', Array.from(validItemIds));
    
    let fixedSections = 0;
    let removedReferences = 0;
    
    // Revisar cada sección
    for (const section of archiveSections.items) {
      const fields = section.fields;
      let needsUpdate = false;
      
      if (fields.items && fields.items['en-US']) {
        const originalItems = fields.items['en-US'];
        const validItems = [];
        const brokenItems = [];
        
        // Filtrar items válidos
        originalItems.forEach(itemRef => {
          if (itemRef.sys && itemRef.sys.id) {
            if (validItemIds.has(itemRef.sys.id)) {
              validItems.push(itemRef);
            } else {
              brokenItems.push(itemRef.sys.id);
            }
          }
        });
        
        if (brokenItems.length > 0) {
          console.log(`\n🔧 Section: ${fields.title ? fields.title['en-US'] : 'Unknown'} (${section.sys.id})`);
          console.log(`  - Original items: ${originalItems.length}`);
          console.log(`  - Valid items: ${validItems.length}`);
          console.log(`  - Broken references: ${brokenItems.join(', ')}`);
          
          // Actualizar la sección con solo los items válidos
          section.fields.items['en-US'] = validItems;
          needsUpdate = true;
          removedReferences += brokenItems.length;
        }
      }
      
      if (needsUpdate) {
        try {
          const updatedSection = await section.update();
          await updatedSection.publish();
          fixedSections++;
          console.log(`  ✅ Updated and published section`);
        } catch (error) {
          console.error(`  ❌ Failed to update section:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Fix complete!`);
    console.log(`  - Sections fixed: ${fixedSections}`);
    console.log(`  - Broken references removed: ${removedReferences}`);
    
    // Mostrar estadísticas finales
    console.log(`\n📊 Final Statistics:`);
    console.log(`  - Total archive items: ${archiveItems.items.length}`);
    console.log(`  - Total archive sections: ${archiveSections.items.length}`);
    
    // Agrupar por categoría
    const categoryCounts = {};
    archiveItems.items.forEach(item => {
      const category = item.fields.category ? item.fields.category['en-US'] : 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    console.log(`\n📂 Items by Category:`);
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} items`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing references:', error);
    throw error;
  }
}

// Ejecutar script
async function main() {
  try {
    await fixBrokenReferences();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 