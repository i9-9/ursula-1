/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function investigatePuma() {
  try {
    console.log('🔍 INVESTIGANDO ENTRADAS DE PUMA');
    console.log('=================================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener TODAS las entradas (incluyendo archivadas, drafts, etc.)
    const allEntriesResponse = await environment.getEntries({ 
      content_type: 'archiveItem', 
      limit: 1000,
      include: 0 // No incluir referencias para ver el estado puro
    });
    
    console.log(`📊 Total de entradas (todos los estados): ${allEntriesResponse.items.length}`);
    
    // Filtrar las que contienen "PUMA"
    const pumaEntries = allEntriesResponse.items.filter(item => {
      const project = item.fields.project ? item.fields.project['en-US'] : '';
      return project.toUpperCase().includes('PUMA');
    });
    
    console.log(`\n🎯 Entradas que contienen "PUMA": ${pumaEntries.length}`);
    
    if (pumaEntries.length > 0) {
      pumaEntries.forEach((item, index) => {
        console.log(`\n${index + 1}. ENTRADA PUMA:`);
        console.log(`   🆔 ID: ${item.sys.id}`);
        console.log(`   📝 Proyecto: "${item.fields.project ? item.fields.project['en-US'] : 'SIN NOMBRE'}"`);
        console.log(`   📅 Creado: ${new Date(item.sys.createdAt).toLocaleString()}`);
        console.log(`   📝 Actualizado: ${new Date(item.sys.updatedAt).toLocaleString()}`);
        console.log(`   📊 Versión: ${item.sys.version}`);
        console.log(`   📍 Estado: ${item.sys.publishedVersion ? 'PUBLICADO' : 'DRAFT'}`);
        console.log(`   🖼️  Thumbnail: ${item.fields.thumbnail ? 'SÍ' : 'NO'}`);
        console.log(`   🎬 Vimeo: ${item.fields.vimeoId ? item.fields.vimeoId['en-US'] : 'Sin vimeo'}`);
        console.log(`   🏢 Company: ${item.fields.company ? item.fields.company['en-US'] : 'Sin company'}`);
        console.log(`   📅 Año: ${item.fields.year ? item.fields.year['en-US'] : 'Sin año'}`);
        
        // Verificar si está archivado
        if (item.sys.archivedVersion) {
          console.log(`   🗄️  ARCHIVADO en versión: ${item.sys.archivedVersion}`);
        }
      });
    }
    
    // También buscar entradas archivadas específicamente
    console.log(`\n🗄️  BUSCANDO ENTRADAS ARCHIVADAS:`);
    try {
      const archivedResponse = await environment.getEntries({ 
        content_type: 'archiveItem',
        'sys.archivedAt[exists]': true,
        limit: 1000
      });
      
      const archivedPuma = archivedResponse.items.filter(item => {
        const project = item.fields.project ? item.fields.project['en-US'] : '';
        return project.toUpperCase().includes('PUMA');
      });
      
      console.log(`📦 Entradas PUMA archivadas: ${archivedPuma.length}`);
      
      if (archivedPuma.length > 0) {
        archivedPuma.forEach((item, index) => {
          console.log(`\n🗄️  ${index + 1}. PUMA ARCHIVADO:`);
          console.log(`   🆔 ID: ${item.sys.id}`);
          console.log(`   📝 Proyecto: "${item.fields.project ? item.fields.project['en-US'] : 'SIN NOMBRE'}"`);
          console.log(`   📅 Archivado: ${new Date(item.sys.archivedAt).toLocaleString()}`);
        });
      }
    } catch (archivedError) {
      console.log(`⚠️  No se pudieron obtener entradas archivadas: ${archivedError.message}`);
    }
    
    console.log(`\n💡 POSIBLES CAUSAS DE LA DUPLICACIÓN VISUAL:`);
    console.log('===========================================');
    console.log('1. Entradas en estado DRAFT que aparecen junto a las publicadas');
    console.log('2. Entradas archivadas que aún se muestran en algunos filtros');
    console.log('3. Diferencias mínimas en el nombre que no detectamos');
    console.log('4. Cache de Contentful mostrando versiones antiguas');
    
  } catch (error) {
    console.error('❌ Error investigando PUMA:', error);
  }
}

investigatePuma(); 