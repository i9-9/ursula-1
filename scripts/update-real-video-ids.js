/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Datos reales de videos con sus URLs
const VIDEO_DATA = [
  // Video Musical
  { project: 'ALOE - CUANDO SERA', url: 'https://vimeo.com/307361595?share=copy' },
  { project: 'CONOCIENDO RUSIA - COSAS PARA DECIRTE', url: 'https://vimeo.com/358550924?share=copy' },
  { project: 'DUKI & DE LA GHETTO & QUEVEDO - SI QUIEREN FRONTEAR', url: 'https://vimeo.com/755400480?share=copy' },
  { project: 'DUKI - ANTES DE PERDERTE', url: 'https://vimeo.com/822866131?share=copy' },
  { project: 'DILLOM - PELOTUDA', url: 'https://vimeo.com/763820558?share=copy' },
  { project: 'LOUTA - NO ME ESTAS HACIENDO UN FAVOR', url: 'https://vimeo.com/465368190?share=copy' },
  { project: 'MARIA BECERRA - OJALA', url: 'https://vimeo.com/843940271?share=copy' },
  { project: 'MARIA BECERRA & PRINCE ROYCE - TE ESPERO', url: 'https://vimeo.com/849201595?share=copy' },
  { project: 'MARIA BECERRA - AUTOMATICO', url: 'https://vimeo.com/845088941?share=copy' },
  { project: 'MARIA BECERRA - CORAZON VACIO', url: 'https://vimeo.com/846342325?share=copy' },
  { project: 'MARIA BECERRA - PRIMER AVISO', url: 'https://vimeo.com/920687890?share=copy' },
  { project: 'MARIA BECERRA - IMAN', url: 'https://vimeo.com/949347671?share=copy' },
  { project: 'JULIETA VENEGAS - EN TU ORILLA', url: 'https://vimeo.com/949273720?share=copy' },
  { project: 'JULIETA VENEGAS - MISMO AMOR', url: 'https://vimeo.com/697182102?share=copy' },
  { project: 'CONOCIENDO RUSIA & NATALIA LAFOURCADE - CINCO HORAS MENOS', url: 'https://vimeo.com/948835251?share=copy' },
  { project: 'CHITA - SOLA', url: 'https://youtu.be/BNrKaLuLjFw?si=krPdVfmkPt3a6lLn' },
  { project: 'SARAMALACARA - MAS FELIZ', url: 'https://vimeo.com/954556710?share=copy' },
  { project: 'TAICHU FT. LALI - S.O.S', url: 'https://vimeo.com/954548653?share=copy' },
  { project: 'DILLOM - BUENOS TIEMPOS', url: 'https://vimeo.com/976712517?share=copy' },
  { project: 'DILLOM - CIRUGIA', url: 'https://vimeo.com/1056379987?share=copy' },
  { project: 'MILO J - ALI OLI', url: 'https://vimeo.com/1004203470' },
  { project: 'MILO J - TRES PECADOS DESPUES', url: 'https://vimeo.com/1004201478' },
  { project: 'SWAGGERBOYS & DILLOM - EL MOROCHO EL RUBIO Y EL COLO', url: 'https://vimeo.com/998984993?share=copy' },
  { project: 'BLAIR - BAR SCORPIOS', url: 'https://vimeo.com/1088054650?share=copy' },
  { project: 'SEBASTIAN YATRA - LA PELIROJA', url: 'https://vimeo.com/1068952865?share=copy' },
  { project: 'SEBASTIAN YATRA - TEMPLO DE PICEAS', url: 'https://vimeo.com/1085539087?share=copy' },
  
  // Comercial
  { project: 'CERVEZA QUILMES - SON OTROS TIEMPOS', url: 'https://vimeo.com/847094947?share=copy' },
  { project: 'BETWARRIOR - DEPORTE&CASINO', url: 'https://vimeo.com/1030870124?share=copy' },
  { project: 'HILERET - ES NATURAL QUE DISFRUTES', url: 'https://vimeo.com/1065521594?share=copy' },
  { project: 'PERSONAL - PERSONAL FLOW', url: 'https://vimeo.com/947537502?share=copy' },
  { project: 'SPOTIFY - MARIA BECERRA', url: 'https://vimeo.com/908650373?share=copy' },
  { project: 'MERCADOLIBRE - BZR X NEW ERA', url: 'https://vimeo.com/850948866?share=copy' },
  { project: 'MAC - BREAST CANCER CAMPAIGN', url: 'https://vimeo.com/993548626?share=copy' },
  { project: 'SPOTIFY - SPOTIFY SINGLES ARGENTINA', url: 'https://vimeo.com/1053519947?share=copy' },
  { project: 'LOLLAPALOOZA - 10 AÑOS - PUNK', url: 'https://vimeo.com/1007473774?share=copy' },
  { project: 'LOLLAPALOOZA - 10 AÑOS - VERBORRAGIA', url: 'https://vimeo.com/1007472921?share=copy' },
  { project: 'BONAFONT MEXICO - KILOMETROS QUE NOS MUEVEN', url: 'https://vimeo.com/917605551?share=copy' },
  
  // Film
  { project: 'SOFIA PONCINI - EL PLANETARIO', url: 'https://vimeo.com/1074655468?share=copy' }
];

// Mapa de correcciones de nombres (CSV -> Contentful)
const NAME_CORRECTIONS = {
  'DUKI - ANTES DE PERDERTE': 'DUKI  - ANTES DE PERDERTE',
  'CHITA - SOLA': 'CHITA  - SOLA',
  'MILO J - TRES PECADOS DESPUES': 'MILO J  - TRES PECADOS DESPUES',
  'MILO J - ALI OLI': 'MILO J - ALI OLI  ',
  'DILLOM - BUENOS TIEMPOS': 'DILLOM  - BUENOS TIEMPOS',
  'DILLOM - CIRUGIA': 'DILOM - CIRUGIA',
  'SWAGGERBOYS & DILLOM - EL MOROCHO EL RUBIO Y EL COLO': 'SWAGGERBOYS & DILLOM  - EL MOROCHO, EL RUBIO Y EL COLO',
  'MERCADOLIBRE - BZR X NEW ERA': 'MERCADOLIBRE - BZRP X NEW ERA ',
  'SPOTIFY - MARIA BECERRA': 'SPOTIFY  - MARIA BECERRA',
  'PERSONAL - PERSONAL FLOW': 'PERSONAL  - PERSONAL FLOW',
  'BONAFONT MEXICO - KILOMETROS QUE NOS MUEVEN': 'BONAFONT MEXICO - KILOMETROS QUE NOS MUEVEN '
};

// Función para extraer ID de Vimeo
function extractVimeoId(url) {
  if (!url || !url.includes('vimeo.com')) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

// Función para extraer ID de YouTube
function extractYouTubeId(url) {
  if (!url || !url.includes('youtu')) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

// Función para crear variaciones de nombres de proyecto
function createProjectVariations(project) {
  // Aplicar correcciones si existen
  const correctedProject = NAME_CORRECTIONS[project] || project;
  
  const variations = [
    project,
    correctedProject,
    project.replace(/ - /g, ' '),
    project.replace(/ - /g, '- '),
    project.replace(/ - /g, ' -'),
    project.replace(/ - /g, '-'),
    project.replace(/  /g, ' '),
    project.trim()
  ];
  
  return [...new Set(variations)]; // Eliminar duplicados
}

async function updateRealVideoIds() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todos los archiveItems
    const archiveItems = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`📋 Total de items en Contentful: ${archiveItems.items.length}`);
    console.log(`📋 Total de videos disponibles: ${VIDEO_DATA.length}`);
    
    // Crear un mapa de IDs de video por nombre de proyecto
    const videoMap = new Map();
    VIDEO_DATA.forEach(video => {
      const vimeoId = extractVimeoId(video.url);
      const youtubeId = extractYouTubeId(video.url);
      
      if (vimeoId || youtubeId) {
        const variations = createProjectVariations(video.project);
        variations.forEach(variation => {
          videoMap.set(variation.toUpperCase(), {
            vimeoId,
            youtubeId,
            originalUrl: video.url,
            originalProject: video.project
          });
        });
      }
    });
    
    console.log(`\n🔄 Procesando items...`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    const notFoundProjects = [];
    
    for (const item of archiveItems.items) {
      const projectName = item.fields.project?.['en-US'] || '';
      const projectNameUpper = projectName.toUpperCase();
      
      const videoData = videoMap.get(projectNameUpper);
      
      if (videoData) {
        try {
          console.log(`➕ Actualizando: ${projectName}`);
          
          // Actualizar campos de video
          if (videoData.vimeoId) {
            item.fields.vimeoId = { 'en-US': videoData.vimeoId };
            console.log(`   🎬 Vimeo ID: ${videoData.vimeoId}`);
          }
          
          if (videoData.youtubeId) {
            item.fields.videoUrl = { 'en-US': videoData.originalUrl };
            console.log(`   📺 YouTube ID: ${videoData.youtubeId}`);
          }
          
          const updatedItem = await item.update();
          await updatedItem.publish();
          
          console.log(`✅ Actualizado: ${projectName}`);
          updatedCount++;
          
        } catch (error) {
          console.error(`❌ Error actualizando ${projectName}:`, error.message);
        }
      } else {
        console.log(`⚠️  No encontrado: ${projectName}`);
        notFoundProjects.push(projectName);
        notFoundCount++;
      }
    }
    
    console.log(`\n🎉 Proceso completado!`);
    console.log(`📊 Items actualizados: ${updatedCount}/${archiveItems.items.length}`);
    console.log(`📊 Items no encontrados: ${notFoundCount}`);
    
    if (notFoundProjects.length > 0) {
      console.log(`\n📋 Proyectos no encontrados:`);
      notFoundProjects.forEach(project => {
        console.log(`  - ${project}`);
      });
    }
    
    console.log(`\n✅ Videos con Vimeo ID asignados: ${VIDEO_DATA.filter(v => extractVimeoId(v.url)).length}`);
    console.log(`✅ Videos con YouTube URL asignados: ${VIDEO_DATA.filter(v => extractYouTubeId(v.url)).length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateRealVideoIds(); 