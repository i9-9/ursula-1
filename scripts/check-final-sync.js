/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Nueva lista actualizada del usuario
const newProjectsList = [
  // MUSIC VIDEOS (26 items)
  { section: "MUSIC VIDEO", project: "ALOE - CUANDO SERA", videoUrl: "https://vimeo.com/307361595", vimeoId: "307361595" },
  { section: "MUSIC VIDEO", project: "CONOCIENDO RUSIA - COSAS PARA DECIRTE", videoUrl: "https://vimeo.com/358550924", vimeoId: "358550924" },
  { section: "MUSIC VIDEO", project: "DUKI & DE LA GHETTO & QUEVEDO - SI QUIEREN FRONTEAR", videoUrl: "https://vimeo.com/755400480", vimeoId: "755400480" },
  { section: "MUSIC VIDEO", project: "DUKI - ANTES DE PERDERTE", videoUrl: "https://vimeo.com/822866131", vimeoId: "822866131" },
  { section: "MUSIC VIDEO", project: "DILLOM - PELOTUDA", videoUrl: "https://vimeo.com/763820558", vimeoId: "763820558" },
  { section: "MUSIC VIDEO", project: "LOUTA - NO ME ESTAS HACIENDO UN FAVOR", videoUrl: "https://vimeo.com/465368190", vimeoId: "465368190" },
  { section: "MUSIC VIDEO", project: "MARIA BECERRA - OJALA", videoUrl: "https://vimeo.com/843940271", vimeoId: "843940271" },
  { section: "MUSIC VIDEO", project: "MARIA BECERRA & PRINCE ROYCE - TE ESPERO", videoUrl: "https://vimeo.com/849201595", vimeoId: "849201595" },
  { section: "MUSIC VIDEO", project: "MARIA BECERRA - AUTOMATICO", videoUrl: "https://vimeo.com/845088941", vimeoId: "845088941" },
  { section: "MUSIC VIDEO", project: "MARIA BECERRA - CORAZON VACIO", videoUrl: "https://vimeo.com/846342325", vimeoId: "846342325" },
  { section: "MUSIC VIDEO", project: "MARIA BECERRA - PRIMER AVISO", videoUrl: "https://vimeo.com/920687890", vimeoId: "920687890" },
  { section: "MUSIC VIDEO", project: "MARIA BECERRA - IMAN", videoUrl: "https://vimeo.com/949347671", vimeoId: "949347671" },
  { section: "MUSIC VIDEO", project: "JULIETA VENEGAS - EN TU ORILLA", videoUrl: "https://vimeo.com/949273720", vimeoId: "949273720" },
  { section: "MUSIC VIDEO", project: "JULIETA VENEGAS - MISMO AMOR", videoUrl: "https://vimeo.com/697182102", vimeoId: "697182102" },
  { section: "MUSIC VIDEO", project: "CONOCIENDO RUSIA & NATALIA LAFOURCADE - CINCO HORAS MENOS", videoUrl: "https://vimeo.com/948835251", vimeoId: "948835251" },
  { section: "MUSIC VIDEO", project: "CHITA - SOLA", videoUrl: "https://youtu.be/BNrKaLuLjFw", youtubeId: "BNrKaLuLjFw" },
  { section: "MUSIC VIDEO", project: "SARAMALACARA - MAS FELIZ", videoUrl: "https://vimeo.com/954556710", vimeoId: "954556710" },
  { section: "MUSIC VIDEO", project: "TAICHU FT. LALI - S.O.S", videoUrl: "https://vimeo.com/954548653", vimeoId: "954548653" },
  { section: "MUSIC VIDEO", project: "DILLOM - BUENOS TIEMPOS", videoUrl: "https://vimeo.com/976712517", vimeoId: "976712517" },
  { section: "MUSIC VIDEO", project: "DILOM - CIRUGIA", videoUrl: "https://vimeo.com/1056379987", vimeoId: "1056379987" },
  { section: "MUSIC VIDEO", project: "MILO J - ALI OLI", videoUrl: "https://vimeo.com/1004203470", vimeoId: "1004203470" },
  { section: "MUSIC VIDEO", project: "MILO J - TRES PECADOS DESPUES", videoUrl: "https://vimeo.com/1004201478", vimeoId: "1004201478" },
  { section: "MUSIC VIDEO", project: "SWAGGERBOYS & DILLOM - EL MOROCHO, EL RUBIO Y EL COLO", videoUrl: "https://vimeo.com/998984993", vimeoId: "998984993" },
  { section: "MUSIC VIDEO", project: "BLAIR - BAR SCORPIOS", videoUrl: "https://vimeo.com/1088054650", vimeoId: "1088054650" },
  { section: "MUSIC VIDEO", project: "SEBASTIAN YATRA - LA PELIROJA", videoUrl: "https://vimeo.com/1068952865", vimeoId: "1068952865" },
  { section: "MUSIC VIDEO", project: "SEBASTIAN YATRA - TEMPLO DE PICEAS", videoUrl: "https://vimeo.com/1085539087", vimeoId: "1085539087" },

  // COMMERCIAL (11 items)
  { section: "COMMERCIAL", project: "CERVEZA QUILMES - SON OTROS TIEMPOS", videoUrl: "https://vimeo.com/847094947", vimeoId: "847094947" },
  { section: "COMMERCIAL", project: "BETWARRIOR - DEPORTE&CASINO", videoUrl: "https://vimeo.com/1030870124", vimeoId: "1030870124" },
  { section: "COMMERCIAL", project: "HILERET - ES NATURAL QUE DISFRUTES", videoUrl: "https://vimeo.com/1065521594", vimeoId: "1065521594" },
  { section: "COMMERCIAL", project: "PERSONAL - PERSONAL FLOW", videoUrl: "https://vimeo.com/947537502", vimeoId: "947537502" },
  { section: "COMMERCIAL", project: "SPOTIFY - MARIA BECERRA", videoUrl: "https://vimeo.com/908650373", vimeoId: "908650373" },
  { section: "COMMERCIAL", project: "MERCADOLIBRE - BZRP X NEW ERA", videoUrl: "https://vimeo.com/850948866", vimeoId: "850948866" },
  { section: "COMMERCIAL", project: "MACMA - BREAST CANCER CAMPAIGN", videoUrl: "https://vimeo.com/993548626", vimeoId: "993548626" },
  { section: "COMMERCIAL", project: "SPOTIFY - SPOTIFY SINGLES ARGENTINA", videoUrl: "https://vimeo.com/1053519947", vimeoId: "1053519947" },
  { section: "COMMERCIAL", project: "LOLLAPALOZA - 10 AÑOS - PUNK", videoUrl: "https://vimeo.com/1007473774", vimeoId: "1007473774" },
  { section: "COMMERCIAL", project: "LOLLAPALOZA - 10 AÑOS - VERBORRAGIA", videoUrl: "https://vimeo.com/1007472921", vimeoId: "1007472921" },
  { section: "COMMERCIAL", project: "BONAFONT MEXICO - KILOMETROS QUE NOS MUEVEN", videoUrl: "https://vimeo.com/917605551", vimeoId: "917605551" },

  // SET DESIGN (5 items)
  { section: "SET DESIGN", project: "RIES - EDITORIAL" },
  { section: "SET DESIGN", project: "PUMA - FASHION WEEK" },
  { section: "SET DESIGN", project: "LUNA ALVAREZ CASTILLO - LOCAL" },
  { section: "SET DESIGN", project: "JAZMIN CHEBAR - ACCESORIOS INVIERNO" },
  { section: "SET DESIGN", project: "MARIA BECERRA - LOLLAPALOZA SHOW" },

  // FILM (1 item)
  { section: "FILM", project: "SOFIA PONCINI - EL PLANETARIO", videoUrl: "https://vimeo.com/1074655468", vimeoId: "1074655468" }
];

function normalizeProjectName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/vegenas/g, 'venegas')
    .replace(/dilom/g, 'dillom');
}

async function checkFinalSync() {
  try {
    console.log('🔍 VERIFICACIÓN DE SINCRONIZACIÓN FINAL');
    console.log('======================================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener datos actuales de Contentful
    const itemsResponse = await environment.getEntries({ content_type: 'archiveItem', limit: 1000 });
    
    console.log(`📊 Nueva lista: ${newProjectsList.length} proyectos`);
    console.log(`📊 Contentful actual: ${itemsResponse.items.length} proyectos`);
    
    // Mostrar la nueva lista por sección
    console.log('\n📋 NUEVA LISTA POR SECCIÓN:');
    const newBySections = {};
    newProjectsList.forEach(item => {
      if (!newBySections[item.section]) {
        newBySections[item.section] = [];
      }
      newBySections[item.section].push(item.project);
    });
    
    Object.keys(newBySections).forEach(section => {
      console.log(`\n📂 ${section} (${newBySections[section].length} items):`);
      newBySections[section].forEach(name => {
        console.log(`  • ${name}`);
      });
    });
    
    // Crear mapas para comparación
    const newProjectNames = new Set(newProjectsList.map(p => normalizeProjectName(p.project)));
    const contentfulItems = new Map();
    
    itemsResponse.items.forEach(item => {
      const project = item.fields.project ? item.fields.project['en-US'] : '';
      const normalizedProject = normalizeProjectName(project);
      contentfulItems.set(normalizedProject, {
        item,
        originalName: project
      });
    });
    
    console.log('\n🔍 ANÁLISIS DE DIFERENCIAS:');
    console.log('===========================');
    
    // Items que están en Contentful pero NO en la nueva lista (eliminar)
    const itemsToDelete = [];
    contentfulItems.forEach(({ originalName }, normalizedName) => {
      if (!newProjectNames.has(normalizedName)) {
        itemsToDelete.push(originalName);
      }
    });
    
    // Items que están en la nueva lista pero NO en Contentful (agregar)
    const itemsToAdd = [];
    newProjectsList.forEach(newItem => {
      const normalizedName = normalizeProjectName(newItem.project);
      if (!contentfulItems.has(normalizedName)) {
        itemsToAdd.push(newItem);
      }
    });
    
    // Items que coinciden pero pueden necesitar actualización de video
    const itemsToUpdate = [];
    newProjectsList.forEach(newItem => {
      const normalizedName = normalizeProjectName(newItem.project);
      const contentfulData = contentfulItems.get(normalizedName);
      
      if (contentfulData) {
        const item = contentfulData.item;
        const currentVimeoId = item.fields.vimeoId ? item.fields.vimeoId['en-US'] : null;
        const currentYouTubeUrl = item.fields.videoUrl ? item.fields.videoUrl['en-US'] : null;
        
        const needsVideoUpdate = 
          (newItem.vimeoId && currentVimeoId !== newItem.vimeoId) ||
          (newItem.youtubeId && !currentYouTubeUrl?.includes(newItem.youtubeId));
        
        if (needsVideoUpdate) {
          itemsToUpdate.push({
            project: newItem.project,
            currentVideo: currentVimeoId || currentYouTubeUrl || 'Sin video',
            newVideo: newItem.vimeoId || newItem.youtubeId || 'Sin video',
            type: newItem.vimeoId ? 'Vimeo' : 'YouTube'
          });
        }
      }
    });
    
    console.log(`❌ Items para ELIMINAR: ${itemsToDelete.length}`);
    console.log(`➕ Items para AGREGAR: ${itemsToAdd.length}`);
    console.log(`🔄 Items para ACTUALIZAR videos: ${itemsToUpdate.length}`);
    console.log(`✅ Items que coinciden: ${newProjectsList.length - itemsToAdd.length}`);
    
    if (itemsToDelete.length > 0) {
      console.log('\n🗑️  ITEMS A ELIMINAR:');
      itemsToDelete.forEach(name => {
        console.log(`  • ${name}`);
      });
    }
    
    if (itemsToAdd.length > 0) {
      console.log('\n➕ ITEMS A AGREGAR:');
      itemsToAdd.forEach(item => {
        const videoInfo = item.vimeoId ? `(Vimeo: ${item.vimeoId})` : 
                         item.youtubeId ? `(YouTube: ${item.youtubeId})` : '(Sin video)';
        console.log(`  • ${item.project} ${videoInfo} → ${item.section}`);
      });
    }
    
    if (itemsToUpdate.length > 0) {
      console.log('\n🔄 VIDEOS A ACTUALIZAR:');
      itemsToUpdate.forEach(item => {
        console.log(`  • ${item.project}`);
        console.log(`    Actual: ${item.currentVideo} → Nuevo: ${item.newVideo} (${item.type})`);
      });
    }
    
    const isFullySynced = itemsToDelete.length === 0 && itemsToAdd.length === 0 && itemsToUpdate.length === 0;
    
    if (isFullySynced) {
      console.log('\n✅ ¡PERFECTAMENTE SINCRONIZADO!');
      console.log('🎉 No se necesitan cambios.');
    } else {
      console.log('\n⚠️  SINCRONIZACIÓN REQUERIDA');
      console.log('📝 Se necesitan cambios para estar al día.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkFinalSync(); 