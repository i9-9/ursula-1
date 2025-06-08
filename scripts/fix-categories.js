/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Mapeo basado en los datos del Google Sheets
const CATEGORY_MAPPING = {
  // MUSIC VIDEO projects
  'ALOE - CUANDO SERA': 'MUSIC VIDEO',
  'CONOCIENDO RUSIA - COSAS PARA DECIRTE': 'MUSIC VIDEO',
  'DUKI & DE LA GHETTO & QUEVEDO - SI QUIEREN FRONTEAR': 'MUSIC VIDEO',
  'DUKI - ANTES DE PERDERTE': 'MUSIC VIDEO',
  'DILLOM - PELOTUDA': 'MUSIC VIDEO',
  'LOUTA - NO ME ESTAS HACIENDO UN FAVOR': 'MUSIC VIDEO',
  'MARIA BECERRA - OJALA': 'MUSIC VIDEO',
  'MARIA BECERRA & PRINCE ROYCE - TE ESPERO': 'MUSIC VIDEO',
  'MARIA BECERRA - AUTOMATICO': 'MUSIC VIDEO',
  'MARIA BECERRA - CORAZON VACIO': 'MUSIC VIDEO',
  'MARIA BECERRA - PRIMER AVISO': 'MUSIC VIDEO',
  'MARIA BECERRA - IMAN': 'MUSIC VIDEO',
  'JULIETA VEGENAS - EN TU ORILLA': 'MUSIC VIDEO',
  'JULIETA VEGENAS - MISMO AMOR': 'MUSIC VIDEO',
  'CONOCIENDO RUSIA & NATALIA LAFOURCADE - CINCO HORAS MENOS': 'MUSIC VIDEO',
  'CHITA - SOLA': 'MUSIC VIDEO',
  'SARAMALACARA - MAS FELIZ': 'MUSIC VIDEO',
  'WANDI - COMO TE VEO': 'MUSIC VIDEO',
  'DILLOM & BOWIE - REDES': 'MUSIC VIDEO',
  
  // Default category logic
  getCategory(project, company) {
    const projectUpper = (project || '').toUpperCase();
    const companyUpper = (company || '').toUpperCase();
    
    // Lógica basada en project name patterns
    if (projectUpper.includes('MUSIC') || projectUpper.includes('VIDEO') || 
        projectUpper.includes('SONG') || companyUpper.includes('PANTERA') ||
        companyUpper.includes('ANESTESIA') || companyUpper.includes('ASALTO')) {
      return 'MUSIC VIDEO';
    }
    if (projectUpper.includes('COMMERCIAL') || projectUpper.includes('AD') ||
        companyUpper.includes('BRAND')) {
      return 'COMMERCIAL';
    }
    if (projectUpper.includes('SET') || projectUpper.includes('DESIGN') ||
        projectUpper.includes('INTERIOR')) {
      return 'SET DESIGN';
    }
    if (projectUpper.includes('FILM') || projectUpper.includes('MOVIE') ||
        projectUpper.includes('CINEMA')) {
      return 'FILM';
    }
    
    // Default to MUSIC VIDEO if unsure (since most entries are music videos)
    return 'MUSIC VIDEO';
  }
};

async function fixCategories() {
  console.log('🏷️ Fixing categories for archive items...');
  
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas de archivo
    const archiveItems = await environment.getEntries({
      content_type: 'archiveItem',
      limit: 1000
    });
    
    console.log(`📊 Found ${archiveItems.items.length} archive items to categorize`);
    
    let updatedCount = 0;
    const categoryStats = {};
    
    for (const item of archiveItems.items) {
      const fields = item.fields;
      const project = fields.project ? fields.project['en-US'] : '';
      const company = fields.company ? fields.company['en-US'] : '';
      
      // Determinar categoría
      const projectKey = `${project}`.toUpperCase().trim();
      let category = CATEGORY_MAPPING[projectKey] || CATEGORY_MAPPING.getCategory(project, company);
      
      // Verificar si ya tiene la categoría correcta
      const currentCategory = fields.category ? fields.category['en-US'] : null;
      
      if (currentCategory !== category) {
        console.log(`\n🏷️ Updating: ${project}`);
        console.log(`  - Current: ${currentCategory || 'None'}`);
        console.log(`  - New: ${category}`);
        console.log(`  - Company: ${company}`);
        
        // Actualizar categoría
        item.fields.category = { 'en-US': category };
        
        try {
          const updatedItem = await item.update();
          await updatedItem.publish();
          updatedCount++;
          console.log(`  ✅ Updated and published`);
        } catch (error) {
          console.error(`  ❌ Failed to update:`, error.message);
        }
      }
      
      // Contar estadísticas
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    }
    
    console.log(`\n🎉 Category fix complete!`);
    console.log(`  - Items updated: ${updatedCount}`);
    console.log(`  - Total items: ${archiveItems.items.length}`);
    
    console.log(`\n📊 Final Category Distribution:`);
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} items`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing categories:', error);
    throw error;
  }
}

// Ejecutar script
async function main() {
  try {
    await fixCategories();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 