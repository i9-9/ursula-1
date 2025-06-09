/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function checkMissingThumbnails() {
  try {
    console.log('🔍 VERIFICANDO PROYECTOS SIN THUMBNAIL');
    console.log('======================================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas del archive
    const itemsResponse = await environment.getEntries({ 
      content_type: 'archiveItem', 
      limit: 1000 
    });
    
    console.log(`📊 Total de proyectos: ${itemsResponse.items.length}`);
    
    // Separar por sección
    const sections = await environment.getEntries({ 
      content_type: 'archiveSection', 
      limit: 100 
    });
    
    console.log(`📋 Secciones encontradas: ${sections.items.length}`);
    
    const sectionMap = new Map();
    sections.items.forEach(section => {
      const title = section.fields.title ? section.fields.title['en-US'] : 'Sin título';
      sectionMap.set(section.sys.id, title);
    });
    
    // Categorizar proyectos
    const projectsBySection = new Map();
    const projectsWithThumbnail = [];
    const projectsWithoutThumbnail = [];
    
    itemsResponse.items.forEach(item => {
      const project = item.fields.project ? item.fields.project['en-US'] : 'SIN NOMBRE';
      const hasThumbnail = !!(item.fields.thumbnail && item.fields.thumbnail['en-US']);
      const year = item.fields.year ? item.fields.year['en-US'] : 'Sin año';
      const company = item.fields.company ? item.fields.company['en-US'] : 'Sin company';
      const vimeoId = item.fields.vimeoId ? item.fields.vimeoId['en-US'] : 'Sin vimeo';
      
      // Determinar sección
      let sectionTitle = 'Sin sección';
      if (item.fields.section && item.fields.section['en-US']) {
        const sectionId = item.fields.section['en-US'].sys.id;
        sectionTitle = sectionMap.get(sectionId) || 'Sección desconocida';
      }
      
      const projectInfo = {
        id: item.sys.id,
        project,
        year,
        company,
        vimeoId,
        sectionTitle,
        hasThumbnail,
        createdAt: item.sys.createdAt
      };
      
      // Agrupar por sección
      if (!projectsBySection.has(sectionTitle)) {
        projectsBySection.set(sectionTitle, { with: [], without: [] });
      }
      
      if (hasThumbnail) {
        projectsWithThumbnail.push(projectInfo);
        projectsBySection.get(sectionTitle).with.push(projectInfo);
      } else {
        projectsWithoutThumbnail.push(projectInfo);
        projectsBySection.get(sectionTitle).without.push(projectInfo);
      }
    });
    
    // RESUMEN GENERAL
    console.log(`\n📊 RESUMEN GENERAL:`);
    console.log('===================');
    console.log(`✅ Proyectos CON thumbnail: ${projectsWithThumbnail.length}`);
    console.log(`❌ Proyectos SIN thumbnail: ${projectsWithoutThumbnail.length}`);
    console.log(`📈 Porcentaje completado: ${Math.round((projectsWithThumbnail.length / itemsResponse.items.length) * 100)}%`);
    
    // RESUMEN POR SECCIÓN
    console.log(`\n📋 RESUMEN POR SECCIÓN:`);
    console.log('========================');
    
    projectsBySection.forEach((data, sectionTitle) => {
      const total = data.with.length + data.without.length;
      const percentage = total > 0 ? Math.round((data.with.length / total) * 100) : 0;
      
      console.log(`\n📁 ${sectionTitle.toUpperCase()}`);
      console.log(`   Total: ${total} | Con thumbnail: ${data.with.length} | Sin thumbnail: ${data.without.length} | Completado: ${percentage}%`);
    });
    
    // PROYECTOS SIN THUMBNAIL (DETALLADO)
    if (projectsWithoutThumbnail.length > 0) {
      console.log(`\n❌ PROYECTOS SIN THUMBNAIL (${projectsWithoutThumbnail.length}):`);
      console.log('==========================================');
      
      projectsBySection.forEach((data, sectionTitle) => {
        if (data.without.length > 0) {
          console.log(`\n📁 ${sectionTitle.toUpperCase()} (${data.without.length} sin thumbnail):`);
          console.log('-'.repeat(50));
          
          data.without.forEach((project, index) => {
            console.log(`${index + 1}. "${project.project}"`);
            console.log(`   🆔 ID: ${project.id}`);
            console.log(`   📅 Año: ${project.year}`);
            console.log(`   🏢 Company: ${project.company}`);
            console.log(`   🎬 Vimeo: ${project.vimeoId}`);
            console.log(`   📅 Creado: ${new Date(project.createdAt).toLocaleDateString()}`);
            console.log('');
          });
        }
      });
      
      console.log(`\n💡 RECOMENDACIONES:`);
      console.log('===================');
      console.log('• Revisa si hay imágenes disponibles en las carpetas locales');
      console.log('• Usa los scripts de subida de thumbnails para cada sección');
      console.log('• Verifica que los nombres de los archivos coincidan con los proyectos');
      
    } else {
      console.log('\n🎉 ¡EXCELENTE! Todos los proyectos tienen thumbnail asignado.');
    }
    
    // LISTA DE PROYECTOS CON THUMBNAIL (RESUMEN)
    console.log(`\n✅ PROYECTOS CON THUMBNAIL (${projectsWithThumbnail.length}):`);
    console.log('=========================================');
    
    projectsBySection.forEach((data, sectionTitle) => {
      if (data.with.length > 0) {
        console.log(`📁 ${sectionTitle.toUpperCase()}: ${data.with.length} proyectos`);
        data.with.forEach((project, index) => {
          console.log(`   ${index + 1}. ${project.project}`);
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Error verificando thumbnails:', error);
  }
}

checkMissingThumbnails(); 