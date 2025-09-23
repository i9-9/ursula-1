// Script para debuggear el problema del Vimeo ID
const { getProjects } = require('./lib/contentful.ts');

async function debugVimeoProjects() {
  try {
    console.log('🔍 Buscando proyectos con Vimeo ID...');
    
    const projects = await getProjects();
    
    console.log(`📊 Total de proyectos encontrados: ${projects.length}`);
    
    // Buscar proyectos con Vimeo ID
    const projectsWithVimeo = projects.filter(p => p.vimeoId && p.vimeoId.trim() !== '');
    
    console.log(`🎥 Proyectos con Vimeo ID: ${projectsWithVimeo.length}`);
    
    projectsWithVimeo.forEach((project, index) => {
      console.log(`\n📹 Proyecto ${index + 1}:`);
      console.log(`   Título: ${project.title}`);
      console.log(`   Artista: ${project.artist}`);
      console.log(`   Vimeo ID: "${project.vimeoId}"`);
      console.log(`   Slug: ${project.slug}`);
      console.log(`   URL: https://player.vimeo.com/video/${project.vimeoId}`);
      
      // Verificar si es Sofia Poncini
      if (project.artist.toLowerCase().includes('sofia') || 
          project.artist.toLowerCase().includes('poncini') ||
          project.title.toLowerCase().includes('sofia') ||
          project.title.toLowerCase().includes('poncini')) {
        console.log(`   ⭐ ¡ESTE ES EL PROYECTO DE SOFIA PONCINI!`);
      }
    });
    
    // Buscar específicamente Sofia Poncini
    const sofiaProject = projects.find(p => 
      p.artist.toLowerCase().includes('sofia') || 
      p.artist.toLowerCase().includes('poncini') ||
      p.title.toLowerCase().includes('sofia') ||
      p.title.toLowerCase().includes('poncini')
    );
    
    if (sofiaProject) {
      console.log(`\n🎯 PROYECTO DE SOFIA PONCINI ENCONTRADO:`);
      console.log(`   Título: ${sofiaProject.title}`);
      console.log(`   Artista: ${sofiaProject.artist}`);
      console.log(`   Vimeo ID: "${sofiaProject.vimeoId}"`);
      console.log(`   Slug: ${sofiaProject.slug}`);
      console.log(`   URL completa: https://player.vimeo.com/video/${sofiaProject.vimeoId}`);
    } else {
      console.log(`\n❌ No se encontró proyecto de Sofia Poncini`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugVimeoProjects();
