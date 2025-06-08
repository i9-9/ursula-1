/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Proyectos exactos del Google Sheets (basado en las filas visibles)
const GOOGLE_SHEETS_PROJECTS = [
  // MUSIC VIDEO (filas 5-23 del Google Sheets)
  { artist: 'ALOE', title: 'CUANDO SERA', year: '2021', company: 'PANTERA', category: 'MUSIC VIDEO' },
  { artist: 'CONOCIENDO RUSIA', title: 'COSAS PARA DECIRTE', year: '2021', company: 'PANTERA', category: 'MUSIC VIDEO' },
  { artist: 'DUKI & DE LA GHETTO & QUEVEDO', title: 'SI QUIEREN FRONTEAR', year: '2022', company: 'ANESTESIA', category: 'MUSIC VIDEO' },
  { artist: 'DUKI', title: 'ANTES DE PERDERTE', year: '2022', company: 'ANESTESIA', category: 'MUSIC VIDEO' },
  { artist: 'DILLOM', title: 'PELOTUDA', year: '2022', company: 'BOHEMIAN GROOVE CORP', category: 'MUSIC VIDEO' },
  { artist: 'LOUTA', title: 'NO ME ESTAS HACIENDO UN FAVOR', year: '2022', company: 'JAIME JAMES', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', title: 'OJALA', year: '2022', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA & PRINCE ROYCE', title: 'TE ESPERO', year: '2022', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', title: 'AUTOMATICO', year: '2022', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', title: 'CORAZON VACIO', year: '2023', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', title: 'PRIMER AVISO', year: '2024', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', title: 'IMAN', year: '2024', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'JULIETA VEGENAS', title: 'EN TU ORILLA', year: '2022', company: 'LA CASA DE AL LADO', category: 'MUSIC VIDEO' },
  { artist: 'JULIETA VEGENAS', title: 'MISMO AMOR', year: '2022', company: 'LA CASA DE AL LADO', category: 'MUSIC VIDEO' },
  { artist: 'CONOCIENDO RUSIA & NATALIA LAFOURCADE', title: 'CINCO HORAS MENOS', year: '2024', company: 'MAMAHUNGARA', category: 'MUSIC VIDEO' },
  { artist: 'CHITA', title: 'SOLA', year: '2024', company: 'THE MOVEMENT / LANDIA', category: 'MUSIC VIDEO' },
  { artist: 'SARAMALACARA', title: 'MAS FELIZ', year: '2024', company: 'CASTADIVA', category: 'MUSIC VIDEO' },
  { artist: 'WANDI', title: 'COMO TE VEO', year: '2024', company: 'CASTADIVA', category: 'MUSIC VIDEO' },
  { artist: 'DILLOM & BOWIE', title: 'REDES', year: '2024', company: 'POSTER', category: 'MUSIC VIDEO' },
  
  // COMMERCIAL (filas 26-34 del Google Sheets)
  { artist: 'CERVEZA QUILMES', title: 'SON OTROS TIEMPOS', year: '2024', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  { artist: 'BETWARRIOR', title: 'DEPORTE&CASINO', year: '2024', company: 'MAMAHUNGARA', category: 'COMMERCIAL' },
  { artist: 'PERSONAL', title: 'PERSONAL FLOW', year: '2024', company: 'POSTER', category: 'COMMERCIAL' },
  { artist: 'SPOTIFY', title: 'MARIA BECERRA', year: '2024', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  { artist: 'SPOTIFY', title: 'SPOTIFY SINGLES ARGENTINA', year: '2024', company: 'POSTER', category: 'COMMERCIAL' },
  { artist: 'BONAFONT MEXICO', title: 'KILOMETROS QUE NOS MUEVEN', year: '2024', company: 'MAMA HUNGARA', category: 'COMMERCIAL' },
  { artist: 'HILERET', title: 'ES NATURAL QUE DISFRUTES', year: '2023', company: 'REINO BUENOS AIRES', category: 'COMMERCIAL' },
  { artist: 'MERCADOLIBRE', title: 'BZRP X NEW ERA', year: '2023', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  { artist: 'SEBASTIAN YATRA', title: 'LA PELIROJA', year: '2025', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  
  // SET DESIGN (filas 37-43 del Google Sheets)
  { artist: 'RIES', title: 'EDITORIAL', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'PUMA', title: 'FASHION WEEK', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'LUNA ALVAREZ CASTILLO', title: 'LOCAL', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'JAZMIN CHEBAR', title: 'ACCESORIOS INVIERNO', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'FLORIAN', title: 'SHOW EN NICETO', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'MARIA BECERRA', title: 'LOLLAPALOZA SHOW', year: '2023', company: '', category: 'SET DESIGN' },
  { artist: 'LAS LOMAS', title: 'FERNANDO RODRIGUEZ', year: '2025', company: '', category: 'SET DESIGN' },
  
  // FILM (filas 46-48 del Google Sheets)
  { artist: 'SOFIA PONCINI', title: 'EL PLANETARIO', year: '2025', company: 'REBOLUCION', category: 'FILM' },
  { artist: 'BLAIR', title: 'BAR SCORPIOS', year: '2025', company: 'POSTER', category: 'FILM' },
  { artist: 'DILLOM', title: 'BUENOS TIEMPOS', year: '2024', company: 'POSTER', category: 'FILM' }
];

function normalizeProjectName(artist, title) {
  return `${artist} - ${title}`.toUpperCase().trim();
}

function normalizeForComparison(name) {
  return name.toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-&]/g, '')
    .trim();
}

async function compareWithGoogleSheets() {
  console.log('📊 Comparando proyectos del Google Sheets con Contentful...');
  console.log(`📋 Proyectos en Google Sheets: ${GOOGLE_SHEETS_PROJECTS.length}`);
  
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas de archivo
    const archiveItems = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`📊 Proyectos en Contentful: ${archiveItems.items.length}`);
    
    // Crear mapa de proyectos en Contentful
    const contentfulProjects = new Map();
    archiveItems.items.forEach(item => {
      const fields = item.fields;
      const project = fields.project ? fields.project['en-US'] : '';
      const normalizedKey = normalizeForComparison(project);
      
      contentfulProjects.set(normalizedKey, {
        id: item.sys.id,
        originalProject: project,
        year: fields.year ? fields.year['en-US'] : '',
        company: fields.company ? fields.company['en-US'] : '',
        category: fields.category ? fields.category['en-US'] : 'Sin categoría'
      });
    });
    
    // Analizar cada proyecto del Google Sheets
    const missing = [];
    const found = [];
    const approximate = [];
    
    GOOGLE_SHEETS_PROJECTS.forEach(gsProject => {
      const fullName = normalizeProjectName(gsProject.artist, gsProject.title);
      const normalizedFullName = normalizeForComparison(fullName);
      
      // Buscar coincidencia exacta
      if (contentfulProjects.has(normalizedFullName)) {
        found.push({
          googleSheets: gsProject,
          contentful: contentfulProjects.get(normalizedFullName),
          match: 'exact'
        });
      } else {
        // Buscar coincidencias aproximadas
        let foundApproximate = false;
        
        for (const [contentfulKey, contentfulItem] of contentfulProjects) {
          // Buscar por artista
          const artistNormalized = normalizeForComparison(gsProject.artist);
          const titleNormalized = normalizeForComparison(gsProject.title);
          
          if (contentfulKey.includes(artistNormalized) && contentfulKey.includes(titleNormalized)) {
            approximate.push({
              googleSheets: gsProject,
              contentful: contentfulItem,
              match: 'approximate',
              reason: 'Similar artist and title'
            });
            foundApproximate = true;
            break;
          }
        }
        
        if (!foundApproximate) {
          missing.push(gsProject);
        }
      }
    });
    
    // Proyectos extra en Contentful
    const googleSheetsKeys = new Set(
      GOOGLE_SHEETS_PROJECTS.map(p => normalizeForComparison(normalizeProjectName(p.artist, p.title)))
    );
    
    const extraInContentful = [];
    contentfulProjects.forEach((item, key) => {
      if (!googleSheetsKeys.has(key)) {
        extraInContentful.push(item);
      }
    });
    
    // Mostrar resultados
    console.log('\n🔍 COMPARACIÓN GOOGLE SHEETS vs CONTENTFUL');
    console.log('===========================================');
    
    console.log(`\n✅ PROYECTOS ENCONTRADOS: ${found.length}`);
    found.forEach(item => {
      console.log(`  ✅ ${item.googleSheets.artist} - ${item.googleSheets.title} (${item.googleSheets.year})`);
      console.log(`     📍 En Contentful: ${item.contentful.originalProject}`);
    });
    
    console.log(`\n🔄 COINCIDENCIAS APROXIMADAS: ${approximate.length}`);
    approximate.forEach(item => {
      console.log(`  🔄 ${item.googleSheets.artist} - ${item.googleSheets.title} (${item.googleSheets.year})`);
      console.log(`     📍 En Contentful: ${item.contentful.originalProject}`);
      console.log(`     💡 Razón: ${item.reason}`);
    });
    
    console.log(`\n❌ PROYECTOS FALTANTES: ${missing.length}`);
    missing.forEach(project => {
      console.log(`  ❌ ${project.artist} - ${project.title} (${project.year}) [${project.category}]`);
      console.log(`     🏢 Company: ${project.company}`);
    });
    
    console.log(`\n➕ PROYECTOS EXTRA EN CONTENTFUL: ${extraInContentful.length}`);
    extraInContentful.forEach(item => {
      console.log(`  ➕ ${item.originalProject} (${item.year})`);
      console.log(`     🏢 Company: ${item.company} | 🏷️ ${item.category}`);
    });
    
    // Estadísticas por categoría
    console.log(`\n📊 ESTADÍSTICAS POR CATEGORÍA:`);
    
    const gsCategories = {};
    GOOGLE_SHEETS_PROJECTS.forEach(p => {
      gsCategories[p.category] = (gsCategories[p.category] || 0) + 1;
    });
    
    const foundCategories = {};
    found.forEach(item => {
      const cat = item.googleSheets.category;
      foundCategories[cat] = (foundCategories[cat] || 0) + 1;
    });
    
    Object.keys(gsCategories).forEach(category => {
      const total = gsCategories[category];
      const foundCount = foundCategories[category] || 0;
      const percentage = Math.round((foundCount / total) * 100);
      console.log(`  📂 ${category}: ${foundCount}/${total} (${percentage}%)`);
    });
    
    console.log(`\n🎯 RESUMEN FINAL:`);
    console.log(`  📋 Total Google Sheets: ${GOOGLE_SHEETS_PROJECTS.length}`);
    console.log(`  📊 Total Contentful: ${archiveItems.items.length}`);
    console.log(`  ✅ Encontrados: ${found.length + approximate.length}`);
    console.log(`  ❌ Faltantes: ${missing.length}`);
    console.log(`  ➕ Extras: ${extraInContentful.length}`);
    console.log(`  📈 Completitud: ${Math.round(((found.length + approximate.length) / GOOGLE_SHEETS_PROJECTS.length) * 100)}%`);
    
    if (missing.length === 0) {
      console.log('\n🎉 ¡TODOS LOS PROYECTOS DEL GOOGLE SHEETS ESTÁN EN CONTENTFUL!');
    } else {
      console.log(`\n⚠️ Faltan ${missing.length} proyectos por agregar del Google Sheets.`);
    }
    
  } catch (error) {
    console.error('❌ Error comparando proyectos:', error);
    throw error;
  }
}

// Ejecutar script
async function main() {
  try {
    await compareWithGoogleSheets();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 