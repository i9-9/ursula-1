const contentful = require('contentful-management');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config({ path: '.env.local' });

// Configuración de Contentful Management API
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN, // Necesitarás este token
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Función para importar datos del CSV
async function importArchiveData(csvFilePath) {
  try {
    console.log('🚀 Iniciando importación de datos del archivo...');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Datos organizados por sección
    const sections = {
      'MUSIC VIDEO': [],
      'COMMERCIAL': [],
      'SET DESIGN': [],
      'FILM': []
    };
    
    // Leer el CSV
    const results = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            console.log(`📄 Leyendo ${results.length} filas del CSV...`);
            
            // Procesar cada fila
            let currentSection = null;
            
            for (const row of results) {
              // Detectar headers de sección
              if (row.VIDEO === 'MUSIC VIDEO' || 
                  row.VIDEO === 'COMMERCIAL' || 
                  row.VIDEO === 'SET DESIGN' || 
                  row.VIDEO === 'FILM') {
                currentSection = row.VIDEO;
                continue;
              }
              
              // Skip headers de columnas
              if (row.ARTISTA === 'ARTISTA' || 
                  row.ARTISTA === 'CLIENTE' || 
                  row.ARTISTA === 'DIRECTOR') {
                continue;
              }
              
              // Agregar datos a la sección correspondiente
              if (currentSection && row.ARTISTA) {
                sections[currentSection].push({
                  project: row['NOMBRE DEL TEMA'] || row['NOMBRE DEL PROYECTO'] || '',
                  artist: row.ARTISTA || row.CLIENTE || row.DIRECTOR || '',
                  year: row.AÑO || '',
                  company: row['PRODUCTION COMPANY'] || ''
                });
              }
            }
            
            console.log('📊 Secciones procesadas:');
            Object.keys(sections).forEach(section => {
              console.log(`  ${section}: ${sections[section].length} items`);
            });
            
            // Crear entradas en Contentful
            for (const [sectionTitle, items] of Object.entries(sections)) {
              if (items.length > 0) {
                await createArchiveSection(environment, sectionTitle, items);
              }
            }
            
            console.log('✅ Importación completada exitosamente!');
            resolve();
            
          } catch (error) {
            console.error('❌ Error procesando CSV:', error);
            reject(error);
          }
        });
    });
    
  } catch (error) {
    console.error('❌ Error en importación:', error);
    throw error;
  }
}

// Función para crear una sección de archivo
async function createArchiveSection(environment, title, items) {
  try {
    console.log(`📝 Creando sección: ${title} con ${items.length} items...`);
    
    // Primero crear los items individuales
    const archiveItemIds = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      try {
        const archiveItem = await environment.createEntry('archiveItem', {
          fields: {
            project: { 'en-US': item.project },
            year: { 'en-US': item.year },
            company: { 'en-US': item.company },
            order: { 'en-US': i + 1 }
          }
        });
        
        await archiveItem.publish();
        archiveItemIds.push({
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: archiveItem.sys.id
          }
        });
        
        console.log(`  ✓ Creado item: ${item.project}`);
        
      } catch (error) {
        console.error(`  ❌ Error creando item ${item.project}:`, error.message);
      }
    }
    
    // Luego crear la sección que agrupa los items
    if (archiveItemIds.length > 0) {
      const archiveSection = await environment.createEntry('archiveSection', {
        fields: {
          title: { 'en-US': title },
          items: { 'en-US': archiveItemIds },
          order: { 'en-US': getSectionOrder(title) }
        }
      });
      
      await archiveSection.publish();
      console.log(`✅ Sección "${title}" creada con ${archiveItemIds.length} items`);
    }
    
  } catch (error) {
    console.error(`❌ Error creando sección ${title}:`, error);
  }
}

// Función para ordenar secciones
function getSectionOrder(title) {
  const order = {
    'MUSIC VIDEO': 1,
    'COMMERCIAL': 2,
    'SET DESIGN': 3,
    'FILM': 4
  };
  return order[title] || 999;
}

// Ejecutar el script
if (require.main === module) {
  const csvPath = process.argv[2] || './archive-data.csv';
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Archivo CSV no encontrado:', csvPath);
    console.log('💡 Uso: node scripts/import-archive.js [ruta-del-csv]');
    process.exit(1);
  }
  
  importArchiveData(csvPath)
    .then(() => {
      console.log('🎉 ¡Importación completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en importación:', error);
      process.exit(1);
    });
}

module.exports = { importArchiveData }; 