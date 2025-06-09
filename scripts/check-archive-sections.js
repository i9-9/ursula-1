/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
});

async function checkArchiveSections() {
  try {
    console.log('🔍 ANALIZANDO SECCIONES DEL ARCHIVE');
    console.log('===================================');
    
    // Obtener todas las secciones del archive
    const sectionsResponse = await client.getEntries({
      content_type: 'archiveSection',
      order: ['fields.order'],
      include: 2, // Incluir referencias anidadas
    });
    
    console.log(`📊 Total de secciones encontradas: ${sectionsResponse.items.length}\n`);
    
    let totalItems = 0;
    
    sectionsResponse.items.forEach((section, index) => {
      const title = section.fields.title || 'Sin título';
      const order = section.fields.order || 0;
      const items = section.fields.items || [];
      
      console.log(`${index + 1}. 📂 SECCIÓN: ${title}`);
      console.log(`   📋 Order: ${order}`);
      console.log(`   📦 Items: ${items.length}`);
      console.log(`   🆔 Section ID: ${section.sys.id}`);
      
      if (items.length > 0) {
        console.log(`   📝 Proyectos en esta sección:`);
        items.forEach((item, idx) => {
          // Verificar si el item está cargado correctamente
          if (item.fields) {
            const project = item.fields.project || 'Sin nombre';
            const year = item.fields.year || 'Sin año';
            const company = item.fields.company || 'Sin compañía';
            const hasThumbnail = item.fields.thumbnail ? '🖼️' : '❌';
            const hasVimeo = item.fields.vimeoId ? '🎬' : '';
            const hasVideo = item.fields.videoUrl ? '📹' : '';
            
            console.log(`      ${idx + 1}. ${project} ${hasThumbnail}${hasVimeo}${hasVideo}`);
            console.log(`         📅 ${year} | 🏢 ${company}`);
            totalItems++;
          } else {
            console.log(`      ${idx + 1}. ⚠️  Item reference not loaded: ${item.sys?.id}`);
          }
        });
      } else {
        console.log(`   ⚠️  Esta sección no tiene items`);
      }
      console.log('');
    });
    
    console.log('📈 RESUMEN:');
    console.log('===========');
    console.log(`📂 Total secciones: ${sectionsResponse.items.length}`);
    console.log(`📦 Total items en secciones: ${totalItems}`);
    console.log(`🎯 Status: ${totalItems > 0 ? '✅ Archive funcionando correctamente' : '❌ Archive vacío'}`);
    
    // Verificar items huérfanos (sin sección)
    const allItemsResponse = await client.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`\n🔍 VERIFICACIÓN DE ITEMS:`);
    console.log(`📦 Total items en Contentful: ${allItemsResponse.items.length}`);
    console.log(`📂 Items asignados a secciones: ${totalItems}`);
    console.log(`🔍 Items huérfanos: ${allItemsResponse.items.length - totalItems}`);
    
  } catch (error) {
    console.error('❌ Error verificando secciones:', error);
  }
}

checkArchiveSections(); 