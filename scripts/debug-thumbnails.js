/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';
const IMAGES_FOLDER = './imagenes_subida';

// Mapeo de nombres de archivos a nombres de proyectos en Contentful
const nameMapping = {
  'PERSONAL - PERSONAL FLOW.png': 'PERSONAL - PERSONAL FLOW',
  'BETWARRIOR - CASINO&DEPORTE.png': 'BETWARRIOR - DEPORTE&CASINO',
  'HILERET - ES NATURAL QUE DISFRUTES.png': 'HILERET - ES NATURAL QUE DISFRUTES',
  'MERCADOLIBRE - BZRP X NEW ERA.png': 'MERCADOLIBRE - BZRP X NEW ERA',
  'SPOTIFY - MARIA BECERRA.png': 'SPOTIFY - MARIA BECERRA',
  'SPOTIFY ARGENTINA - SPOTIFY SINGLES.png': 'SPOTIFY - SPOTIFY SINGLES ARGENTINA',
  'BONAFONT - KILOMETROS QUE NOS MUEVEN.png': 'BONAFONT MEXICO - KILOMETROS QUE NOS MUEVEN',
  'CERVEZA QUILMES - SON OTROS TIEMPOS.png': 'CERVEZA QUILMES - SON OTROS TIEMPOS'
};

function normalizeProjectName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, ' - ');
}

async function debugThumbnails() {
  try {
    console.log('🔍 DEBUG DE THUMBNAILS');
    console.log('======================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas del archive
    const itemsResponse = await environment.getEntries({ 
      content_type: 'archiveItem', 
      limit: 1000 
    });
    
    console.log(`📊 Total entradas encontradas: ${itemsResponse.items.length}\n`);
    
    // Crear mapa de entradas
    const entriesMap = new Map();
    itemsResponse.items.forEach(item => {
      const project = item.fields.project ? item.fields.project['en-US'] : '';
      const normalizedName = normalizeProjectName(project);
      entriesMap.set(normalizedName, { item, originalName: project });
    });
    
    // Obtener lista de imágenes
    const imageFiles = fs.readdirSync(IMAGES_FOLDER)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
    
    console.log(`📷 Imágenes disponibles: ${imageFiles.length}\n`);
    
    // Analizar cada imagen
    for (const fileName of imageFiles) {
      console.log(`\n🖼️  ANALIZANDO: ${fileName}`);
      console.log('─'.repeat(50));
      
      // Obtener el nombre del proyecto correspondiente
      const projectName = nameMapping[fileName] || fileName.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '');
      const normalizedProjectName = normalizeProjectName(projectName);
      
      console.log(`📝 Nombre en archivo: "${fileName}"`);
      console.log(`🔗 Mapeo a proyecto: "${projectName}"`);
      console.log(`🔍 Nombre normalizado: "${normalizedProjectName}"`);
      
      // Buscar la entrada correspondiente
      const entryData = entriesMap.get(normalizedProjectName);
      if (!entryData) {
        console.log(`❌ NO SE ENCONTRÓ entrada para: "${projectName}"`);
        console.log(`💡 Proyectos disponibles similares:`);
        
        // Buscar proyectos similares
        const similarProjects = [];
        for (const [key, value] of entriesMap) {
          if (key.includes(projectName.toLowerCase().split(' ')[0]) || 
              projectName.toLowerCase().includes(value.originalName.toLowerCase().split(' ')[0])) {
            similarProjects.push(value.originalName);
          }
        }
        
        if (similarProjects.length > 0) {
          similarProjects.forEach(proj => {
            console.log(`   • "${proj}"`);
          });
        } else {
          console.log(`   • No se encontraron proyectos similares`);
        }
        continue;
      }
      
      console.log(`✅ ENTRADA ENCONTRADA: "${entryData.originalName}"`);
      
      // Verificar si ya tiene thumbnail
      const currentThumbnail = entryData.item.fields.thumbnail;
      if (currentThumbnail && currentThumbnail['en-US']) {
        console.log(`🖼️  YA TIENE THUMBNAIL: ${currentThumbnail['en-US'].sys.id}`);
      } else {
        console.log(`❌ NO TIENE THUMBNAIL`);
      }
    }
    
    console.log('\n📊 RESUMEN DE COMERCIAL:');
    console.log('========================');
    
    // Filtrar solo proyectos de COMMERCIAL
    const commercialProjects = itemsResponse.items.filter(item => {
      const project = item.fields.project ? item.fields.project['en-US'] : '';
      return ['CERVEZA QUILMES', 'BETWARRIOR', 'HILERET', 'PERSONAL', 'SPOTIFY', 'MERCADOLIBRE', 'MACMA', 'LOLLAPALOZA', 'BONAFONT'].some(brand => 
        project.toUpperCase().includes(brand)
      );
    });
    
    console.log(`📦 Proyectos de COMMERCIAL encontrados: ${commercialProjects.length}`);
    
    commercialProjects.forEach((item, index) => {
      const project = item.fields.project ? item.fields.project['en-US'] : '';
      const hasThumbnail = item.fields.thumbnail && item.fields.thumbnail['en-US'] ? '🖼️' : '❌';
      console.log(`${index + 1}. ${hasThumbnail} ${project}`);
    });
    
  } catch (error) {
    console.error('❌ Error en debug:', error);
  }
}

debugThumbnails(); 