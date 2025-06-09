/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Función para extraer ID de Vimeo
function extractVimeoId(url) {
  if (!url || !url.includes('vimeo')) return '';
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : '';
}

// Función para extraer ID de YouTube
function extractYouTubeId(url) {
  if (!url || !url.includes('youtu')) return '';
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
}

// Data completa del archive
const archiveData = {
  'MUSIC VIDEO': [
    { url: 'https://vimeo.com/307361595', project: 'ALOE - CUANDO SERA', year: '2021', company: 'PANTERA' },
    { url: 'https://vimeo.com/358550924', project: 'CONOCIENDO RUSIA - COSAS PARA DECIRTE', year: '2021', company: 'PANTERA' },
    { url: 'https://vimeo.com/755400480', project: 'DUKI & DE LA GHETTO & QUEVEDO - SI QUIEREN FRONTEAR', year: '2022', company: 'ANESTESIA' },
    { url: 'https://vimeo.com/822866131', project: 'DUKI - ANTES DE PERDERTE', year: '2022', company: 'ANESTESIA' },
    { url: 'https://vimeo.com/763820558', project: 'DILLOM - PELOTUDA', year: '2022', company: 'BOHEMIAN GROOVE CORP' },
    { url: 'https://vimeo.com/465368190', project: 'LOUTA - NO ME ESTAS HACIENDO UN FAVOR', year: '2022', company: 'JAIME JAMES' },
    { url: 'https://vimeo.com/843940271', project: 'MARIA BECERRA - OJALA', year: '2022', company: 'ASALTO' },
    { url: 'https://vimeo.com/849201595', project: 'MARIA BECERRA & PRINCE ROYCE - TE ESPERO', year: '2022', company: 'ASALTO' },
    { url: 'https://vimeo.com/845088941', project: 'MARIA BECERRA - AUTOMATICO', year: '2022', company: 'ASALTO' },
    { url: 'https://vimeo.com/846342325', project: 'MARIA BECERRA - CORAZON VACIO', year: '2023', company: 'ASALTO' },
    { url: 'https://vimeo.com/920687890', project: 'MARIA BECERRA - PRIMER AVISO', year: '2024', company: 'ASALTO' },
    { url: 'https://vimeo.com/949347671', project: 'MARIA BECERRA - IMAN', year: '2024', company: 'ASALTO' },
    { url: 'https://vimeo.com/949273720', project: 'JULIETA VENEGAS - EN TU ORILLA', year: '2022', company: 'LA CASA DE AL LADO' },
    { url: 'https://vimeo.com/697182102', project: 'JULIETA VENEGAS - MISMO AMOR', year: '2022', company: 'LA CASA DE AL LADO' },
    { url: 'https://vimeo.com/948835251', project: 'CONOCIENDO RUSIA & NATALIA LAFOURCADE - CINCO HORAS MENOS', year: '2024', company: 'MAMAHUNGARA' },
    { url: 'https://youtu.be/BNrKaLuLjFw', project: 'CHITA - SOLA', year: '2024', company: 'THE MOVEMENT / LANDIA' },
    { url: 'https://vimeo.com/954556710', project: 'SARAMALACARA - MAS FELIZ', year: '2024', company: 'CASTADIVA' },
    { url: 'https://vimeo.com/954548653', project: 'TAICHU FT. LALI - S.O.S', year: '2024', company: 'CASTADIVA' },
    { url: 'https://vimeo.com/976712517', project: 'DILLOM - BUENOS TIEMPOS', year: '2024', company: 'POSTER' },
    { url: 'https://vimeo.com/1056379987', project: 'DILOM - CIRUGIA', year: '2024', company: 'POSTER' },
    { url: 'https://vimeo.com/1004203470', project: 'MILO J - ALI OLI', year: '2024', company: 'ARENA COLLECTIVE' },
    { url: 'https://vimeo.com/1004201478', project: 'MILO J - TRES PECADOS DESPUES', year: '2024', company: 'ARENA COLLECTIVE' },
    { url: 'https://vimeo.com/998984993', project: 'SWAGGERBOYS & DILLOM - EL MOROCHO, EL RUBIO Y EL COLO', year: '2024', company: 'THE MOVEMENT / LANDIA' },
    { url: 'https://vimeo.com/1088054650', project: 'BLAIR - BAR SCORPIOS', year: '2025', company: 'POSTER' },
    { url: 'https://vimeo.com/1068952865', project: 'SEBASTIAN YATRA - LA PELIROJA', year: '2025', company: 'THE MOVEMENT / LANDIA' },
    { url: 'https://vimeo.com/1085539087', project: 'SEBASTIAN YATRA - TEMPLO DE PICEAS', year: '2025', company: 'THE MOVEMENT / LANDIA' }
  ],
  'COMMERCIAL': [
    { url: 'https://vimeo.com/847094947', project: 'CERVEZA QUILMES - SON OTROS TIEMPOS', year: '2024', company: 'THE MOVEMENT / LANDIA' },
    { url: 'https://vimeo.com/1030870124', project: 'BETWARRIOR - DEPORTE&CASINO', year: '2024', company: 'MAMAHUNGARA' },
    { url: 'https://vimeo.com/1065521594', project: 'HILERET - ES NATURAL QUE DISFRUTES', year: '2023', company: 'REINO BUENOS AIRES' },
    { url: 'https://vimeo.com/947537502', project: 'PERSONAL - PERSONAL FLOW', year: '2024', company: 'POSTER' },
    { url: 'https://vimeo.com/908650373', project: 'SPOTIFY - MARIA BECERRA', year: '2024', company: 'THE MOVEMENT / LANDIA' },
    { url: 'https://vimeo.com/850948866', project: 'MERCADOLIBRE - BZRP X NEW ERA', year: '2023', company: 'THE MOVEMENT / LANDIA' },
    { url: 'https://vimeo.com/993548626', project: 'MACMA - BREAST CANCER CAMPAIGN', year: '2024', company: 'POSTER' },
    { url: 'https://vimeo.com/1053519947', project: 'SPOTIFY - SPOTIFY SINGLES ARGENTINA', year: '2024', company: 'POSTER' },
    { url: 'https://vimeo.com/1007473774', project: 'LOLLAPALOZA - 10 AÑOS - PUNK', year: '2024', company: '' },
    { url: 'https://vimeo.com/1007472921', project: 'LOLLAPALOZA - 10 AÑOS - VERBORRAGIA', year: '2024', company: '' },
    { url: 'https://vimeo.com/917605551', project: 'BONAFONT MEXICO - KILOMETROS QUE NOS MUEVEN', year: '2024', company: 'MAMA HUNGARA' }
  ],
  'SET DESIGN': [
    { url: '', project: 'RIES - EDITORIAL', year: '2024', company: '' },
    { url: '', project: 'PUMA - FASHION WEEK', year: '2024', company: '' },
    { url: '', project: 'LUNA ALVAREZ CASTILLO - LOCAL', year: '2024', company: '' },
    { url: '', project: 'JAZMIN CHEBAR - ACCESORIOS INVIERNO', year: '2024', company: '' },
    { url: '', project: 'MARIA BECERRA - LOLLAPALOZA SHOW', year: '2023', company: '' }
  ],
  'FILM': [
    { url: 'https://vimeo.com/1074655468', project: 'SOFIA PONCINI - EL PLANETARIO', year: '2025', company: 'REBOLUCION' }
  ]
};

async function syncArchiveData() {
  try {
    console.log('🚀 INICIANDO SINCRONIZACIÓN COMPLETA DEL ARCHIVE');
    console.log('=================================================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las secciones existentes
    const sectionsResponse = await environment.getEntries({ 
      content_type: 'archiveSection',
      limit: 1000 
    });
    
    // Crear mapa de secciones existentes
    const existingSections = new Map();
    sectionsResponse.items.forEach(section => {
      const title = section.fields.title ? section.fields.title['en-US'] : '';
      existingSections.set(title, section);
    });
    
    // Obtener todos los items existentes
    const itemsResponse = await environment.getEntries({ 
      content_type: 'archiveItem',
      limit: 1000 
    });
    
    // Crear mapa de items existentes por nombre de proyecto
    const existingItems = new Map();
    itemsResponse.items.forEach(item => {
      const project = item.fields.project ? item.fields.project['en-US'] : '';
      existingItems.set(project, item);
    });
    
    let totalCreated = 0;
    let totalUpdated = 0;
    
    // Procesar cada sección
    for (const [sectionTitle, items] of Object.entries(archiveData)) {
      console.log(`\n📂 Procesando sección: ${sectionTitle}`);
      console.log(`   Items: ${items.length}`);
      
      // Crear/actualizar items de la sección
      const sectionItemRefs = [];
      
      for (const itemData of items) {
        const { url, project, year, company } = itemData;
        
        const vimeoId = extractVimeoId(url);
        const youtubeId = extractYouTubeId(url);
        const videoUrl = youtubeId ? url : (url && !vimeoId ? url : '');
        
        console.log(`   📝 Procesando: ${project}`);
        
        let archiveItem;
        if (existingItems.has(project)) {
          // Actualizar item existente
          archiveItem = existingItems.get(project);
          console.log(`      ✏️  Actualizando item existente`);
          
          archiveItem.fields.year = { 'en-US': year };
          archiveItem.fields.company = { 'en-US': company };
          if (vimeoId) archiveItem.fields.vimeoId = { 'en-US': vimeoId };
          if (videoUrl) archiveItem.fields.videoUrl = { 'en-US': videoUrl };
          
          archiveItem = await archiveItem.update();
          await archiveItem.publish();
          totalUpdated++;
        } else {
          // Crear nuevo item
          console.log(`      ✨ Creando nuevo item`);
          
          const fields = {
            project: { 'en-US': project },
            year: { 'en-US': year },
            company: { 'en-US': company }
          };
          
          if (vimeoId) fields.vimeoId = { 'en-US': vimeoId };
          if (videoUrl) fields.videoUrl = { 'en-US': videoUrl };
          
          archiveItem = await environment.createEntry('archiveItem', { fields });
          await archiveItem.publish();
          totalCreated++;
        }
        
        // Agregar referencia al item
        sectionItemRefs.push({
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: archiveItem.sys.id
          }
        });
      }
      
      // Crear/actualizar sección
      let section;
      if (existingSections.has(sectionTitle)) {
        console.log(`   📂 Actualizando sección existente: ${sectionTitle}`);
        section = existingSections.get(sectionTitle);
        section.fields.items = { 'en-US': sectionItemRefs };
        section = await section.update();
        await section.publish();
      } else {
        console.log(`   📂 Creando nueva sección: ${sectionTitle}`);
        
        const sectionOrder = {
          'MUSIC VIDEO': 1,
          'COMMERCIAL': 2,
          'SET DESIGN': 3,
          'FILM': 4
        };
        
        section = await environment.createEntry('archiveSection', {
          fields: {
            title: { 'en-US': sectionTitle },
            items: { 'en-US': sectionItemRefs },
            order: { 'en-US': sectionOrder[sectionTitle] || 1 }
          }
        });
        await section.publish();
      }
      
      console.log(`   ✅ Sección ${sectionTitle} completada`);
    }
    
    // RESUMEN FINAL
    console.log('\n🎉 SINCRONIZACIÓN COMPLETADA');
    console.log('============================');
    console.log(`📊 Items creados: ${totalCreated}`);
    console.log(`📊 Items actualizados: ${totalUpdated}`);
    console.log(`📊 Total items: ${totalCreated + totalUpdated}`);
    console.log('✅ ¡Toda la data del archive ha sido sincronizada!');
    console.log('🌟 Visita http://localhost:3002 para ver los cambios');
    
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
  }
}

syncArchiveData(); 