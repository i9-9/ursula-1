/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Lista completa de proyectos del Google Sheets
const EXPECTED_PROJECTS = [
  // MUSIC VIDEO
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
  
  // COMMERCIAL (basado en los nombres del Google Sheets)
  { artist: 'CERVEZA QUILMES', title: 'SON OTROS TIEMPOS', year: '2024', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  { artist: 'MERCADOLIBRE', title: 'BZRP X NEW ERA', year: '2023', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  { artist: 'BONAFONT MEXICO', title: 'KILOMETROS QUE NOS MUEVEN', year: '2024', company: 'MAMA HUNGARA', category: 'COMMERCIAL' },
  { artist: 'PERSONAL', title: 'PERSONAL FLOW', year: '2024', company: 'POSTER', category: 'COMMERCIAL' },
  { artist: 'HILERET', title: 'ES NATURAL QUE DISFRUTES', year: '2023', company: 'REINO BUENOS AIRES', category: 'COMMERCIAL' },
  { artist: 'BETWARRIOR', title: 'DEPORTE&CASINO', year: '2024', company: 'MAMAHUNGARA', category: 'COMMERCIAL' },
  { artist: 'SPOTIFY', title: 'SPOTIFY SINGLES ARGENTINA', year: '2024', company: 'POSTER', category: 'COMMERCIAL' },
  { artist: 'SPOTIFY', title: 'MARIA BECERRA', year: '2024', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  { artist: 'SEBASTIAN YATRA', title: 'LA PELIROJA', year: '2025', company: 'THE MOVEMENT / LANDIA', category: 'MUSIC VIDEO' },
  
  // SET DESIGN
  { artist: 'PUMA', title: 'FASHION WEEK', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'JAZMIN CHEBAR', title: 'ACCESORIOS INVIERNO', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'LUNA ALVAREZ CASTILLO', title: 'LOCAL', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'RIES', title: 'EDITORIAL', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'FLORIAN', title: 'SHOW EN NICETO', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'MARIA BECERRA', title: 'LOLLAPALOZA SHOW', year: '2023', company: '', category: 'SET DESIGN' },
  { artist: 'LAS LOMAS', title: 'FERNANDO RODRIGUEZ', year: '2025', company: '', category: 'SET DESIGN' },
  
  // FILM
  { artist: 'SOFIA PONCINI', title: 'EL PLANETARIO', year: '2025', company: 'REBOLUCION', category: 'FILM' },
  { artist: 'BLAIR', title: 'BAR SCORPIOS', year: '2025', company: 'POSTER', category: 'FILM' },
  { artist: 'DILLOM', title: 'BUENOS TIEMPOS', year: '2024', company: 'POSTER', category: 'FILM' },
  
  // Adicionales que veo en los logs
  { artist: 'TAICHU FT. LALI', title: 'S.O.S', year: '2024', company: 'CASTADIVA', category: 'MUSIC VIDEO' }
];

function normalizeProjectName(artist, title) {
  return `${artist} - ${title}`.toUpperCase().trim();
}

async function verifyAllItems() {
  console.log('🔍 Verifying all items from Google Sheets are in Contentful...');
  console.log(`📊 Expected projects: ${EXPECTED_PROJECTS.length}`);
  
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas de archivo
    const archiveItems = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`📊 Found ${archiveItems.items.length} items in Contentful`);
    
    // Crear mapas para comparación
    const contentfulProjects = new Map();
    archiveItems.items.forEach(item => {
      const fields = item.fields;
      const project = fields.project ? fields.project['en-US'] : '';
      const year = fields.year ? fields.year['en-US'] : '';
      const company = fields.company ? fields.company['en-US'] : '';
      const key = project.toUpperCase().trim();
      
      contentfulProjects.set(key, {
        id: item.sys.id,
        project,
        year,
        company,
        hasCategory: fields.category ? fields.category['en-US'] : null
      });
    });
    
    // Verificar cada proyecto esperado
    const missing = [];
    const found = [];
    const missingCategories = [];
    
    EXPECTED_PROJECTS.forEach(expectedProject => {
      const expectedKey = normalizeProjectName(expectedProject.artist, expectedProject.title);
      
      if (contentfulProjects.has(expectedKey)) {
        const foundItem = contentfulProjects.get(expectedKey);
        found.push({
          expected: expectedProject,
          found: foundItem
        });
        
        if (!foundItem.hasCategory) {
          missingCategories.push({
            project: expectedKey,
            id: foundItem.id,
            expectedCategory: expectedProject.category
          });
        }
      } else {
        missing.push(expectedProject);
      }
    });
    
    // Verificar items extras en Contentful
    const expectedKeys = new Set(EXPECTED_PROJECTS.map(p => normalizeProjectName(p.artist, p.title)));
    const extraItems = [];
    
    contentfulProjects.forEach((item, key) => {
      if (!expectedKeys.has(key)) {
        extraItems.push(item);
      }
    });
    
    // Mostrar resultados
    console.log('\n📊 VERIFICATION RESULTS:');
    console.log('========================');
    
    console.log(`\n✅ Items Found: ${found.length}/${EXPECTED_PROJECTS.length}`);
    found.forEach(item => {
      const categoryStatus = item.found.hasCategory ? '✅' : '❌';
      console.log(`  ${categoryStatus} ${item.expected.artist} - ${item.expected.title} (${item.expected.year})`);
    });
    
    console.log(`\n❌ Missing Items: ${missing.length}`);
    missing.forEach(item => {
      console.log(`  - ${item.artist} - ${item.title} (${item.year}) [${item.category}]`);
    });
    
    console.log(`\n🏷️ Items Missing Category: ${missingCategories.length}`);
    missingCategories.forEach(item => {
      console.log(`  - ${item.project} (ID: ${item.id}) -> Should be: ${item.expectedCategory}`);
    });
    
    console.log(`\n🔄 Extra Items in Contentful: ${extraItems.length}`);
    extraItems.forEach(item => {
      console.log(`  - ${item.project} (${item.year}) - Company: ${item.company}`);
    });
    
    // Estadísticas por categoría
    const categoryStats = {};
    found.forEach(item => {
      const category = item.expected.category;
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });
    
    console.log(`\n📂 Category Distribution:`);
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} items`);
    });
    
    console.log(`\n🎯 Summary:`);
    console.log(`  - Completion: ${Math.round((found.length / EXPECTED_PROJECTS.length) * 100)}%`);
    console.log(`  - Missing: ${missing.length} items`);
    console.log(`  - Need categories: ${missingCategories.length} items`);
    console.log(`  - Extra items: ${extraItems.length} items`);
    
    if (missing.length === 0 && missingCategories.length === 0) {
      console.log('\n🎉 ALL ITEMS ARE PRESENT AND PROPERLY CATEGORIZED!');
    } else if (missing.length === 0) {
      console.log('\n✅ All items are present, but some need categories added.');
    } else {
      console.log('\n⚠️ Some items are missing or need attention.');
    }
    
  } catch (error) {
    console.error('❌ Error verifying items:', error);
    throw error;
  }
}

// Ejecutar script
async function main() {
  try {
    await verifyAllItems();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 