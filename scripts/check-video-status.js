/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function checkVideoStatus() {
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
    
    console.log('🎬 ESTADO DE VIDEOS EN EL ARCHIVO:');
    console.log('==================================');
    
    let totalItems = 0;
    let itemsWithVideo = 0;
    let itemsWithVimeo = 0;
    let itemsWithYouTube = 0;
    let itemsWithoutVideo = 0;
    
    const itemsWithoutVideoList = [];
    const itemsWithVideoList = [];
    
    sections.items.forEach(section => {
      const title = section.fields.title ? section.fields.title['en-US'] : 'Sin título';
      const itemRefs = section.fields.items ? section.fields.items['en-US'] : [];
      
      console.log(`\n📂 ${title}`);
      
      itemRefs.forEach((itemRef, index) => {
        const itemId = itemRef.sys.id;
        const item = items.items.find(i => i.sys.id === itemId);
        
        if (item) {
          const project = item.fields.project ? item.fields.project['en-US'] : 'Sin nombre';
          const vimeoId = item.fields.vimeoId ? item.fields.vimeoId['en-US'] : null;
          const videoUrl = item.fields.videoUrl ? item.fields.videoUrl['en-US'] : null;
          
          totalItems++;
          
          if (vimeoId || videoUrl) {
            itemsWithVideo++;
            
            if (vimeoId) {
              itemsWithVimeo++;
              console.log(`   ✅ ${project} → Vimeo: ${vimeoId}`);
              itemsWithVideoList.push({ project, type: 'Vimeo', id: vimeoId });
            } else if (videoUrl && videoUrl.includes('youtu')) {
              itemsWithYouTube++;
              console.log(`   ✅ ${project} → YouTube: ${videoUrl}`);
              itemsWithVideoList.push({ project, type: 'YouTube', url: videoUrl });
            } else if (videoUrl) {
              console.log(`   ✅ ${project} → Otro video: ${videoUrl}`);
              itemsWithVideoList.push({ project, type: 'Otro', url: videoUrl });
            }
          } else {
            itemsWithoutVideo++;
            console.log(`   ❌ ${project} → Sin video`);
            itemsWithoutVideoList.push({ project, section: title });
          }
        } else {
          console.log(`   ❌ Item no encontrado: ${itemId}`);
        }
      });
    });
    
    console.log(`\n📊 RESUMEN GENERAL:`);
    console.log(`==================`);
    console.log(`📋 Total de items: ${totalItems}`);
    console.log(`✅ Items con video: ${itemsWithVideo} (${Math.round((itemsWithVideo/totalItems)*100)}%)`);
    console.log(`   🎬 Vimeo: ${itemsWithVimeo}`);
    console.log(`   📺 YouTube: ${itemsWithYouTube}`);
    console.log(`❌ Items sin video: ${itemsWithoutVideo}`);
    
    if (itemsWithoutVideoList.length > 0) {
      console.log(`\n❌ ITEMS SIN VIDEO:`);
      itemsWithoutVideoList.forEach(item => {
        console.log(`  • ${item.project} (${item.section})`);
      });
    }
    
    console.log(`\n✅ VIDEOS DISPONIBLES PARA PROBAR:`);
    console.log(`==================================`);
    itemsWithVideoList.slice(0, 10).forEach(item => {
      if (item.type === 'Vimeo') {
        console.log(`🎬 ${item.project} → https://vimeo.com/${item.id}`);
      } else {
        console.log(`📺 ${item.project} → ${item.url}`);
      }
    });
    
    if (itemsWithVideoList.length > 10) {
      console.log(`   ... y ${itemsWithVideoList.length - 10} más`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkVideoStatus(); 