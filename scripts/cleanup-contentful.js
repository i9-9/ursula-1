/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function analyzeContentful() {
  console.log('🔍 Analyzing Contentful for duplicates and corrupted entries...');
  
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas de archivo
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
    
    // Analizar duplicados en archive items
    const duplicateMap = new Map();
    const corruptedItems = [];
    
    archiveItems.items.forEach(item => {
      const fields = item.fields;
      
      // Verificar si tiene campos requeridos
      if (!fields.project || !fields.project['en-US']) {
        corruptedItems.push({
          id: item.sys.id,
          reason: 'Missing project field',
          status: item.sys.publishedVersion ? 'published' : 'draft'
        });
        return;
      }
      
      const project = fields.project['en-US'];
      const year = fields.year ? fields.year['en-US'] : '';
      const company = fields.company ? fields.company['en-US'] : '';
      
      const key = `${project}_${year}_${company}`.toLowerCase().trim();
      
      if (duplicateMap.has(key)) {
        duplicateMap.get(key).push({
          id: item.sys.id,
          project,
          year,
          company,
          status: item.sys.publishedVersion ? 'published' : 'draft',
          publishedAt: item.sys.publishedAt,
          updatedAt: item.sys.updatedAt
        });
      } else {
        duplicateMap.set(key, [{
          id: item.sys.id,
          project,
          year,
          company,
          status: item.sys.publishedVersion ? 'published' : 'draft',
          publishedAt: item.sys.publishedAt,
          updatedAt: item.sys.updatedAt
        }]);
      }
    });
    
    // Encontrar duplicados reales
    const realDuplicates = [];
    duplicateMap.forEach((items, key) => {
      if (items.length > 1) {
        realDuplicates.push({
          key,
          items: items.sort((a, b) => {
            // Priorizar: 1) published sobre draft, 2) más reciente
            if (a.status === 'published' && b.status === 'draft') return -1;
            if (a.status === 'draft' && b.status === 'published') return 1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          })
        });
      }
    });
    
    // Analizar referencias rotas en sections
    const brokenReferences = [];
    const validItemIds = new Set(archiveItems.items.map(item => item.sys.id));
    
    archiveSections.items.forEach(section => {
      const fields = section.fields;
      if (fields.items && fields.items['en-US']) {
        fields.items['en-US'].forEach(itemRef => {
          if (itemRef.sys && itemRef.sys.id) {
            if (!validItemIds.has(itemRef.sys.id)) {
              brokenReferences.push({
                sectionId: section.sys.id,
                sectionTitle: fields.title ? fields.title['en-US'] : 'Unknown',
                brokenItemId: itemRef.sys.id
              });
            }
          }
        });
      }
    });
    
    // Mostrar resultados
    console.log('\n🔍 ANALYSIS RESULTS:');
    console.log('===================');
    
    console.log(`\n❌ Corrupted Items: ${corruptedItems.length}`);
    corruptedItems.forEach(item => {
      console.log(`  - ID: ${item.id} | Reason: ${item.reason} | Status: ${item.status}`);
    });
    
    console.log(`\n🔄 Duplicate Groups: ${realDuplicates.length}`);
    realDuplicates.forEach((group, index) => {
      console.log(`\n  Group ${index + 1}: ${group.key}`);
      group.items.forEach((item, itemIndex) => {
        const marker = itemIndex === 0 ? '✅ KEEP' : '❌ DELETE';
        console.log(`    ${marker} ID: ${item.id} | Status: ${item.status} | Updated: ${item.updatedAt}`);
      });
    });
    
    console.log(`\n🔗 Broken References: ${brokenReferences.length}`);
    brokenReferences.forEach(ref => {
      console.log(`  - Section: ${ref.sectionTitle} (${ref.sectionId}) references missing item: ${ref.brokenItemId}`);
    });
    
    return {
      corruptedItems,
      realDuplicates,
      brokenReferences,
      environment
    };
    
  } catch (error) {
    console.error('❌ Error analyzing Contentful:', error);
    throw error;
  }
}

async function cleanupContentful(dryRun = true) {
  console.log(`\n🧹 Starting cleanup (${dryRun ? 'DRY RUN' : 'REAL CLEANUP'})...`);
  
  const analysis = await analyzeContentful();
  const { corruptedItems, realDuplicates, environment } = analysis;
  
  let deleteCount = 0;
  
  // Limpiar entradas corruptas
  for (const corrupted of corruptedItems) {
    console.log(`${dryRun ? '[DRY RUN]' : ''} Deleting corrupted item: ${corrupted.id}`);
    if (!dryRun) {
      try {
        const entry = await environment.getEntry(corrupted.id);
        if (entry.isPublished()) {
          await entry.unpublish();
        }
        await entry.delete();
        deleteCount++;
      } catch (error) {
        console.error(`Failed to delete ${corrupted.id}:`, error.message);
      }
    }
  }
  
  // Limpiar duplicados (mantener el primero de cada grupo)
  for (const group of realDuplicates) {
    const itemsToDelete = group.items.slice(1); // Todos excepto el primero
    
    for (const item of itemsToDelete) {
      console.log(`${dryRun ? '[DRY RUN]' : ''} Deleting duplicate: ${item.id} (${item.project})`);
      if (!dryRun) {
        try {
          const entry = await environment.getEntry(item.id);
          if (entry.isPublished()) {
            await entry.unpublish();
          }
          await entry.delete();
          deleteCount++;
        } catch (error) {
          console.error(`Failed to delete ${item.id}:`, error.message);
        }
      }
    }
  }
  
  console.log(`\n✅ Cleanup complete! ${dryRun ? 'Would delete' : 'Deleted'} ${deleteCount} entries.`);
  
  if (dryRun) {
    console.log('\n⚠️  This was a dry run. To actually delete entries, run:');
    console.log('node scripts/cleanup-contentful.js --real');
  }
}

// Ejecutar script
async function main() {
  const args = process.argv.slice(2);
  const isRealRun = args.includes('--real');
  
  try {
    await cleanupContentful(!isRealRun);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 