/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Función para normalizar nombres de proyecto para comparación
function normalizeProjectName(artist, track) {
  const combined = `${artist} - ${track}`.toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-&]/g, '')
    .trim();
  return combined;
}

// Función para leer y procesar el CSV
function readCSVData() {
  return new Promise((resolve) => {
    const projects = [];
    let currentCategory = '';
    
    fs.createReadStream('archive-data.csv')
      .pipe(csv({ 
        headers: false,
        skipEmptyLines: false
      }))
      .on('data', (row) => {
        const values = Object.values(row);
        
        // Detectar categorías
        if (values[2] === 'MUSIC VIDEO' || values[2] === 'COMMERCIAL' || 
            values[2] === 'SET DESIGN' || values[2] === 'FILM') {
          currentCategory = values[2];
          return;
        }
        
        // Saltar líneas de encabezado y vacías
        if (!values[2] || values[2] === 'ARTISTA' || values[2] === 'CLIENTE' || 
            values[2] === 'DIRECTOR' || values[2] === '') {
          return;
        }
        
        // Extraer datos del proyecto
        const artist = values[2]?.trim();
        const track = values[3]?.trim();
        const year = values[4]?.trim();
        const company = values[5]?.trim() || '';
        const driveUrl = values[6]?.trim() || '';
        
        if (artist && track && year && currentCategory) {
          projects.push({
            artist,
            track,
            year,
            company,
            category: currentCategory,
            driveUrl,
            normalizedName: normalizeProjectName(artist, track)
          });
        }
      })
      .on('end', () => {
        resolve(projects);
      });
  });
}

async function compareAndImport() {
  console.log('🔄 Procesando CSV actualizado...');
  
  try {
    // Leer datos del CSV
    const csvProjects = await readCSVData();
    console.log(`📋 Proyectos en CSV: ${csvProjects.length}`);
    
    // Conectar a Contentful
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener archiveSections existentes
    const archiveSections = await environment.getEntries({
      content_type: 'archiveSection',
      limit: 1000
    });
    
    // Obtener archiveItems existentes
    const archiveItems = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`📊 Items en Contentful: ${archiveItems.items.length}`);
    
    // Crear mapa de items existentes
    const existingItems = new Map();
    archiveItems.items.forEach(item => {
      const project = item.fields.project?.['en-US'] || '';
      const normalizedKey = project.toUpperCase()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s-&]/g, '')
        .trim();
      existingItems.set(normalizedKey, item);
    });
    
    // Crear mapa de secciones existentes
    const existingSections = new Map();
    archiveSections.items.forEach(section => {
      const title = section.fields.title?.['en-US'] || '';
      existingSections.set(title, section);
    });
    
    // Comparar y encontrar items faltantes
    const missingItems = [];
    const foundItems = [];
    
    csvProjects.forEach(csvProject => {
      const variations = [
        csvProject.normalizedName,
        `${csvProject.artist.toUpperCase().trim()} ${csvProject.track.toUpperCase().trim()}`,
        csvProject.track.toUpperCase().trim(),
        csvProject.artist.toUpperCase().trim()
      ];
      
      let found = false;
      for (const variation of variations) {
        if (existingItems.has(variation)) {
          foundItems.push(csvProject);
          found = true;
          break;
        }
      }
      
      if (!found) {
        missingItems.push(csvProject);
      }
    });
    
    console.log(`\n✅ Items encontrados: ${foundItems.length}`);
    console.log(`❌ Items faltantes: ${missingItems.length}`);
    
    if (missingItems.length === 0) {
      console.log('🎉 ¡Todos los items ya están en Contentful!');
      return;
    }
    
    // Mostrar items faltantes
    console.log('\n📋 ITEMS FALTANTES POR AGREGAR:');
    console.log('================================');
    missingItems.forEach(item => {
      console.log(`📍 ${item.artist} - ${item.track} (${item.year}) [${item.category}]`);
      console.log(`   🏢 ${item.company}`);
      if (item.driveUrl) {
        console.log(`   🔗 ${item.driveUrl}`);
      }
    });
    
    // Confirmar antes de agregar
    console.log(`\n🤔 ¿Agregar ${missingItems.length} items faltantes a Contentful? (y/N)`);
    
    // Para este script, vamos a proceder automáticamente
    console.log('🚀 Procediendo a agregar items faltantes...');
    
    // Agrupar por categoría
    const itemsByCategory = {};
    missingItems.forEach(item => {
      if (!itemsByCategory[item.category]) {
        itemsByCategory[item.category] = [];
      }
      itemsByCategory[item.category].push(item);
    });
    
    // Procesar cada categoría
    for (const [category, items] of Object.entries(itemsByCategory)) {
      console.log(`\n📂 Procesando categoría: ${category}`);
      
      // Crear o encontrar archiveSection
      let section = existingSections.get(category);
      if (!section) {
        console.log(`   ➕ Creando nueva sección: ${category}`);
        section = await environment.createEntry('archiveSection', {
          fields: {
            title: { 'en-US': category },
            order: { 'en-US': Object.keys(itemsByCategory).indexOf(category) + 1 },
            items: { 'en-US': [] }
          }
        });
        await section.publish();
        existingSections.set(category, section);
      }
      
      const newItemIds = [];
      
      // Crear archiveItems
      for (const item of items) {
        try {
          console.log(`   ➕ Agregando: ${item.artist} - ${item.track}`);
          
          const archiveItem = await environment.createEntry('archiveItem', {
            fields: {
              project: { 'en-US': `${item.artist} - ${item.track}` },
              year: { 'en-US': item.year },
              company: { 'en-US': item.company }
            }
          });
          
          await archiveItem.publish();
          newItemIds.push({
            sys: { 
              type: 'Link',
              linkType: 'Entry',
              id: archiveItem.sys.id
            }
          });
          
          console.log(`   ✅ Creado: ${archiveItem.sys.id}`);
          
        } catch (error) {
          console.error(`   ❌ Error creando ${item.artist} - ${item.track}:`, error.message);
        }
      }
      
      // Actualizar archiveSection con nuevos items
      if (newItemIds.length > 0) {
        try {
          const updatedSection = await environment.getEntry(section.sys.id);
          const existingItems = updatedSection.fields.items?.['en-US'] || [];
          
          updatedSection.fields.items = {
            'en-US': [...existingItems, ...newItemIds]
          };
          
          const savedSection = await updatedSection.update();
          await savedSection.publish();
          
          console.log(`   ✅ Sección ${category} actualizada con ${newItemIds.length} nuevos items`);
        } catch (error) {
          console.error(`   ❌ Error actualizando sección ${category}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 ¡Importación completada!');
    console.log(`📊 Items agregados: ${missingItems.length}`);
    console.log(`📂 Categorías procesadas: ${Object.keys(itemsByCategory).length}`);
    
  } catch (error) {
    console.error('❌ Error en importación:', error);
    throw error;
  }
}

// Ejecutar script
async function main() {
  try {
    await compareAndImport();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { compareAndImport }; 