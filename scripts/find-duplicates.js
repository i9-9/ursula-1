/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function findDuplicates() {
  try {
    console.log('🔍 BUSCANDO PROYECTOS DUPLICADOS');
    console.log('=================================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas del archive
    const itemsResponse = await environment.getEntries({ 
      content_type: 'archiveItem', 
      limit: 1000 
    });
    
    console.log(`📊 Total de entradas encontradas: ${itemsResponse.items.length}`);
    
    // Agrupar por nombre de proyecto
    const projectGroups = new Map();
    
    itemsResponse.items.forEach(item => {
      const project = item.fields.project ? item.fields.project['en-US'] : 'SIN NOMBRE';
      
      if (!projectGroups.has(project)) {
        projectGroups.set(project, []);
      }
      projectGroups.get(project).push({
        id: item.sys.id,
        project: project,
        year: item.fields.year ? item.fields.year['en-US'] : 'Sin año',
        company: item.fields.company ? item.fields.company['en-US'] : 'Sin company',
        hasThumbnail: !!(item.fields.thumbnail && item.fields.thumbnail['en-US']),
        vimeoId: item.fields.vimeoId ? item.fields.vimeoId['en-US'] : 'Sin vimeo',
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt,
        version: item.sys.version
      });
    });
    
    // Encontrar duplicados
    const duplicates = [];
    const uniqueProjects = [];
    
    projectGroups.forEach((items, projectName) => {
      if (items.length > 1) {
        duplicates.push({
          projectName,
          items: items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Ordenar por fecha de creación
        });
      } else {
        uniqueProjects.push(items[0]);
      }
    });
    
    console.log(`\n📋 RESUMEN:`);
    console.log(`✅ Proyectos únicos: ${uniqueProjects.length}`);
    console.log(`⚠️  Proyectos duplicados: ${duplicates.length}`);
    console.log(`📊 Total de entradas duplicadas: ${duplicates.reduce((sum, dup) => sum + dup.items.length, 0)}`);
    
    if (duplicates.length > 0) {
      console.log(`\n🔍 DETALLES DE DUPLICADOS:`);
      console.log('===========================');
      
      duplicates.forEach((duplicate, index) => {
        console.log(`\n${index + 1}. "${duplicate.projectName}"`);
        console.log(`   Cantidad de duplicados: ${duplicate.items.length}`);
        
        duplicate.items.forEach((item, itemIndex) => {
          const isOriginal = itemIndex === 0;
          console.log(`   ${isOriginal ? '🟢 ORIGINAL' : '🔴 DUPLICADO'}: ${item.id}`);
          console.log(`      📅 Creado: ${new Date(item.createdAt).toLocaleString()}`);
          console.log(`      📝 Actualizado: ${new Date(item.updatedAt).toLocaleString()}`);
          console.log(`      🖼️  Thumbnail: ${item.hasThumbnail ? 'SÍ' : 'NO'}`);
          console.log(`      🎬 Vimeo: ${item.vimeoId}`);
          console.log(`      🏢 Company: ${item.company}`);
          console.log(`      📊 Versión: ${item.version}`);
        });
      });
      
      console.log(`\n💡 RECOMENDACIONES:`);
      console.log('===================');
      console.log('• Mantener el ORIGINAL (primera entrada creada)');
      console.log('• Eliminar los DUPLICADOS');
      console.log('• Si el duplicado tiene thumbnail y el original no, transferir el thumbnail primero');
      console.log('\n🚨 ¿Quieres que cree un script para limpiar estos duplicados?');
    } else {
      console.log('\n🎉 ¡No se encontraron duplicados! Tu contenido está limpio.');
    }
    
  } catch (error) {
    console.error('❌ Error buscando duplicados:', error);
  }
}

findDuplicates(); 