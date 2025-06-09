/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function checkCommercialProjects() {
  try {
    console.log('🔍 Verificando proyectos comerciales en Contentful...\n');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas del archive
    const archiveEntries = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    // Filtrar solo proyectos comerciales
    const commercialProjects = archiveEntries.items.filter(entry => {
      const archiveSection = entry.fields.archiveSection?.['en-US'];
      return archiveSection && archiveSection.fields && 
             archiveSection.fields.title && 
             archiveSection.fields.title['en-US'] === 'COMMERCIAL';
    });
    
    console.log(`📊 Proyectos comerciales encontrados: ${commercialProjects.length}\n`);
    
    commercialProjects.forEach((project, index) => {
      const projectName = project.fields.project?.['en-US'] || 'Sin nombre';
      const hasThumbnail = project.fields.thumbnail?.['en-US'] ? '✅' : '❌';
      console.log(`${index + 1}. ${projectName} ${hasThumbnail}`);
    });
    
    console.log('\n📁 Archivos de imagen disponibles:');
    const fs = require('fs');
    const files = fs.readdirSync('./imagenes_subida');
    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCommercialProjects(); 