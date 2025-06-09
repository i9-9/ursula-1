/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function listAllProjects() {
  try {
    console.log('📋 Listando todos los proyectos...\n');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas del archive
    const archiveEntries = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`📊 Total de proyectos: ${archiveEntries.items.length}\n`);
    
    // Agrupar por sección
    const projectsBySection = {};
    
    archiveEntries.items.forEach((entry) => {
      const projectName = entry.fields.project?.['en-US'] || 'Sin nombre';
      const year = entry.fields.year?.['en-US'] || 'Sin año';
      const company = entry.fields.company?.['en-US'] || 'Sin compañía';
      const hasThumbnail = entry.fields.thumbnail?.['en-US'] ? '🖼️' : '❌';
      
      // Obtener la sección
      const archiveSection = entry.fields.archiveSection?.['en-US'];
      let sectionName = 'SIN SECCIÓN';
      
      if (archiveSection) {
        if (archiveSection.sys) {
          // Es una referencia, necesitamos el ID
          sectionName = `REF: ${archiveSection.sys.id}`;
        } else if (archiveSection.fields) {
          // Tiene campos directos
          sectionName = archiveSection.fields.title?.['en-US'] || 'Sin título';
        } else {
          sectionName = 'ESTRUCTURA DESCONOCIDA';
        }
      }
      
      if (!projectsBySection[sectionName]) {
        projectsBySection[sectionName] = [];
      }
      
      projectsBySection[sectionName].push({
        name: projectName,
        year,
        company,
        hasThumbnail
      });
    });
    
    // Mostrar agrupados por sección
    Object.keys(projectsBySection).forEach(section => {
      console.log(`\n🎬 ${section} (${projectsBySection[section].length} proyectos):`);
      console.log('=' + '='.repeat(section.length + 15));
      
      projectsBySection[section].forEach((project, index) => {
        console.log(`${index + 1}. ${project.name} ${project.hasThumbnail}`);
        console.log(`   📅 ${project.year} | 🏢 ${project.company}`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listAllProjects(); 