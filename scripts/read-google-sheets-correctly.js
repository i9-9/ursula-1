/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Proyectos exactos leídos del Google Sheets tal como aparecen
// Columna C: ARTISTA, Columna D: NOMBRE DEL TEMA
const GOOGLE_SHEETS_PROJECTS = [
  // MUSIC VIDEO (filas 5-23)
  { artist: 'ALOE', track: 'CUANDO SERA', year: '2021', company: 'PANTERA', category: 'MUSIC VIDEO' },
  { artist: 'CONOCIENDO RUSIA', track: 'COSAS PARA DECIRTE', year: '2021', company: 'PANTERA', category: 'MUSIC VIDEO' },
  { artist: 'DUKI & DE LA GHETTO & QUEVEDO', track: 'SI QUIEREN FRONTEAR', year: '2022', company: 'ANESTESIA', category: 'MUSIC VIDEO' },
  { artist: 'DUKI', track: 'ANTES DE PERDERTE', year: '2022', company: 'ANESTESIA', category: 'MUSIC VIDEO' },
  { artist: 'DILLOM', track: 'PELOTUDA', year: '2022', company: 'BOHEMIAN GROOVE CORP', category: 'MUSIC VIDEO' },
  { artist: 'LOUTA', track: 'NO ME ESTAS HACIENDO UN FAVOR', year: '2022', company: 'JAIME JAMES', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', track: 'OJALA', year: '2022', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA & PRINCE ROYCE', track: 'TE ESPERO', year: '2022', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', track: 'AUTOMATICO', year: '2022', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', track: 'CORAZON VACIO', year: '2023', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', track: 'PRIMER AVISO', year: '2024', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'MARIA BECERRA', track: 'IMAN', year: '2024', company: 'ASALTO', category: 'MUSIC VIDEO' },
  { artist: 'JULIETA VEGENAS', track: 'EN TU ORILLA', year: '2022', company: 'LA CASA DE AL LADO', category: 'MUSIC VIDEO' },
  { artist: 'JULIETA VEGENAS', track: 'MISMO AMOR', year: '2022', company: 'LA CASA DE AL LADO', category: 'MUSIC VIDEO' },
  { artist: 'CONOCIENDO RUSIA & NATALIA LAFOURCADE', track: 'CINCO HORAS MENOS', year: '2024', company: 'MAMAHUNGARA', category: 'MUSIC VIDEO' },
  { artist: 'CHITA', track: 'SOLA', year: '2024', company: 'THE MOVEMENT / LANDIA', category: 'MUSIC VIDEO' },
  { artist: 'SARAMALACARA', track: 'MAS FELIZ', year: '2024', company: 'CASTADIVA', category: 'MUSIC VIDEO' },
  { artist: 'WANDI', track: 'COMO TE VEO', year: '2024', company: 'CASTADIVA', category: 'MUSIC VIDEO' },
  { artist: 'DILLOM & BOWIE', track: 'REDES', year: '2024', company: 'POSTER', category: 'MUSIC VIDEO' },
  
  // COMMERCIAL (aparecen más abajo en el sheets)
  { artist: 'CERVEZA QUILMES', track: 'SON OTROS TIEMPOS', year: '2024', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  { artist: 'BETWARRIOR', track: 'DEPORTE&CASINO', year: '2024', company: 'MAMAHUNGARA', category: 'COMMERCIAL' },
  { artist: 'PERSONAL', track: 'PERSONAL FLOW', year: '2024', company: 'POSTER', category: 'COMMERCIAL' },
  { artist: 'SPOTIFY', track: 'MARIA BECERRA', year: '2024', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  { artist: 'SPOTIFY', track: 'SPOTIFY SINGLES ARGENTINA', year: '2024', company: 'POSTER', category: 'COMMERCIAL' },
  { artist: 'BONAFONT MEXICO', track: 'KILOMETROS QUE NOS MUEVEN', year: '2024', company: 'MAMA HUNGARA', category: 'COMMERCIAL' },
  { artist: 'HILERET', track: 'ES NATURAL QUE DISFRUTES', year: '2023', company: 'REINO BUENOS AIRES', category: 'COMMERCIAL' },
  { artist: 'MERCADOLIBRE', track: 'BZRP X NEW ERA', year: '2023', company: 'THE MOVEMENT / LANDIA', category: 'COMMERCIAL' },
  
  // SET DESIGN
  { artist: 'RIES', track: 'EDITORIAL', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'PUMA', track: 'FASHION WEEK', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'LUNA ALVAREZ CASTILLO', track: 'LOCAL', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'JAZMIN CHEBAR', track: 'ACCESORIOS INVIERNO', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'FLORIAN', track: 'SHOW EN NICETO', year: '2024', company: '', category: 'SET DESIGN' },
  { artist: 'MARIA BECERRA', track: 'LOLLAPALOZA SHOW', year: '2023', company: '', category: 'SET DESIGN' },
  
  // FILM
  { artist: 'SOFIA PONCINI', track: 'EL PLANETARIO', year: '2025', company: 'REBOLUCION', category: 'FILM' },
  { artist: 'LAS LOMAS', track: 'FERNANDO RODRIGUEZ', year: '2025', company: '', category: 'FILM' }
];

function createProjectVariations(artist, track) {
  // Crear diferentes variaciones de cómo puede aparecer el proyecto
  const variations = [
    `${artist} - ${track}`.toUpperCase().trim(),
    `${artist} ${track}`.toUpperCase().trim(),
    `${artist}: ${track}`.toUpperCase().trim(),
    `${artist} FT. ${track}`.toUpperCase().trim(),
    track.toUpperCase().trim(), // Solo el track
    artist.toUpperCase().trim() // Solo el artista
  ];
  
  return variations.map(v => v.replace(/\s+/g, ' ').replace(/[^\w\s-&:]/g, ''));
}

async function readGoogleSheetsCorrectly() {
  console.log('📊 Leyendo Google Sheets correctamente...');
  console.log(`📋 Proyectos esperados: ${GOOGLE_SHEETS_PROJECTS.length}`);
  
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
      const normalizedKey = project.toUpperCase().replace(/\s+/g, ' ').replace(/[^\w\s-&]/g, '').trim();
      
      contentfulProjects.set(normalizedKey, {
        id: item.sys.id,
        originalProject: project,
        year: fields.year ? fields.year['en-US'] : '',
        company: fields.company ? fields.company['en-US'] : '',
        category: fields.category ? fields.category['en-US'] : 'Sin categoría'
      });
    });
    
    console.log('\n🔍 PROYECTOS EN CONTENTFUL:');
    console.log('=============================');
    [...contentfulProjects.values()].forEach(item => {
      console.log(`📍 ${item.originalProject} (${item.year}) - ${item.company} [${item.category}]`);
    });
    
    // Analizar cada proyecto del Google Sheets
    const missing = [];
    const found = [];
    
    GOOGLE_SHEETS_PROJECTS.forEach(gsProject => {
      const variations = createProjectVariations(gsProject.artist, gsProject.track);
      let foundMatch = false;
      
      // Buscar coincidencias exactas
      for (const variation of variations) {
        if (contentfulProjects.has(variation)) {
          found.push({
            googleSheets: gsProject,
            contentful: contentfulProjects.get(variation),
            matchedVariation: variation
          });
          foundMatch = true;
          break;
        }
      }
      
      if (!foundMatch) {
        // Buscar coincidencias parciales
        const possibleMatches = [];
        for (const [contentfulKey, contentfulItem] of contentfulProjects) {
          const artistNorm = gsProject.artist.toUpperCase().replace(/[^\w\s]/g, '');
          const trackNorm = gsProject.track.toUpperCase().replace(/[^\w\s]/g, '');
          
          if (contentfulKey.includes(artistNorm) || contentfulKey.includes(trackNorm)) {
            possibleMatches.push({
              googleSheets: gsProject,
              contentful: contentfulItem,
              reason: `Contiene "${artistNorm}" o "${trackNorm}"`
            });
          }
        }
        
        if (possibleMatches.length > 0) {
          console.log(`\n🔄 POSIBLES COINCIDENCIAS para ${gsProject.artist} - ${gsProject.track}:`);
          possibleMatches.forEach(match => {
            console.log(`   - ${match.contentful.originalProject} (${match.reason})`);
          });
        } else {
          missing.push(gsProject);
        }
      }
    });
    
    // Mostrar resultados
    console.log('\n🔍 ANÁLISIS FINAL:');
    console.log('==================');
    
    console.log(`\n✅ PROYECTOS ENCONTRADOS: ${found.length}`);
    found.forEach(item => {
      console.log(`  ✅ ${item.googleSheets.artist} - ${item.googleSheets.track} (${item.googleSheets.year})`);
      console.log(`     📍 En Contentful: ${item.contentful.originalProject}`);
      console.log(`     🔗 Coincidió con: ${item.matchedVariation}`);
    });
    
    console.log(`\n❌ PROYECTOS FALTANTES: ${missing.length}`);
    missing.forEach(project => {
      console.log(`  ❌ ${project.artist} - ${project.track} (${project.year}) [${project.category}]`);
      console.log(`     🏢 Company: ${project.company}`);
    });
    
    console.log(`\n🎯 RESUMEN:`);
    console.log(`  📋 Total Google Sheets: ${GOOGLE_SHEETS_PROJECTS.length}`);
    console.log(`  📊 Total Contentful: ${archiveItems.items.length}`);
    console.log(`  ✅ Encontrados: ${found.length}`);
    console.log(`  ❌ Faltantes: ${missing.length}`);
    console.log(`  📈 Completitud: ${Math.round((found.length / GOOGLE_SHEETS_PROJECTS.length) * 100)}%`);
    
  } catch (error) {
    console.error('❌ Error leyendo correctamente:', error);
    throw error;
  }
}

// Ejecutar script
async function main() {
  try {
    await readGoogleSheetsCorrectly();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 