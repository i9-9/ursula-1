/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Función para normalizar nombres de proyectos de forma inteligente
function normalizeProjectName(name) {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .trim()
    // Remover espacios extra al final y al principio
    .replace(/^\s+|\s+$/g, '')
    // Normalizar espacios múltiples a uno solo
    .replace(/\s+/g, ' ')
    // Normalizar guiones con espacios
    .replace(/\s*-\s*/g, ' - ')
    // Remover caracteres especiales invisibles
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalizar &
    .replace(/\s*&\s*/g, ' & ');
}

async function findAllDuplicatesAdvanced() {
  try {
    console.log('🔍 BÚSQUEDA AVANZADA DE DUPLICADOS');
    console.log('===================================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Obtener todas las entradas
    const itemsResponse = await environment.getEntries({ 
      content_type: 'archiveItem', 
      limit: 1000 
    });
    
    console.log(`📊 Total de entradas encontradas: ${itemsResponse.items.length}`);
    
    // Agrupar por nombre normalizado
    const normalizedGroups = new Map();
    
    itemsResponse.items.forEach(item => {
      const originalProject = item.fields.project ? item.fields.project['en-US'] : 'SIN NOMBRE';
      const normalizedProject = normalizeProjectName(originalProject);
      
      if (!normalizedGroups.has(normalizedProject)) {
        normalizedGroups.set(normalizedProject, []);
      }
      
      normalizedGroups.get(normalizedProject).push({
        id: item.sys.id,
        originalProject: originalProject,
        normalizedProject: normalizedProject,
        year: item.fields.year ? item.fields.year['en-US'] : 'Sin año',
        company: item.fields.company ? item.fields.company['en-US'] : 'Sin company',
        hasThumbnail: !!(item.fields.thumbnail && item.fields.thumbnail['en-US']),
        thumbnailId: item.fields.thumbnail && item.fields.thumbnail['en-US'] ? item.fields.thumbnail['en-US'].sys.id : null,
        vimeoId: item.fields.vimeoId ? item.fields.vimeoId['en-US'] : 'Sin vimeo',
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt,
        version: item.sys.version,
        publishedVersion: item.sys.publishedVersion
      });
    });
    
    // Encontrar duplicados reales
    const duplicateGroups = [];
    const uniqueProjects = [];
    
    normalizedGroups.forEach((items, normalizedName) => {
      if (items.length > 1) {
        // Verificar si realmente son duplicados (no solo coincidencia de normalización)
        const realDuplicates = items.filter((item, index, arr) => {
          // Si hay diferencias en los nombres originales, podrían ser duplicados
          const otherItems = arr.filter((_, i) => i !== index);
          return otherItems.some(other => {
            const similarity = calculateSimilarity(item.originalProject, other.originalProject);
            return similarity > 0.85; // 85% de similitud o más
          });
        });
        
        if (realDuplicates.length > 1) {
          // Ordenar por fecha de creación (más antiguo primero = original)
          const sortedItems = items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          duplicateGroups.push({
            normalizedName,
            items: sortedItems
          });
        } else {
          uniqueProjects.push(items[0]);
        }
      } else {
        uniqueProjects.push(items[0]);
      }
    });
    
    console.log(`\n📋 RESUMEN:`);
    console.log(`✅ Proyectos únicos: ${uniqueProjects.length}`);
    console.log(`⚠️  Grupos de duplicados encontrados: ${duplicateGroups.length}`);
    
    if (duplicateGroups.length > 0) {
      console.log(`\n🔍 DETALLES DE DUPLICADOS:`);
      console.log('===========================');
      
      duplicateGroups.forEach((group, index) => {
        console.log(`\n${index + 1}. GRUPO: "${group.normalizedName}"`);
        console.log(`   📊 Cantidad de duplicados: ${group.items.length}`);
        
        group.items.forEach((item, itemIndex) => {
          const isOriginal = itemIndex === 0;
          console.log(`\n   ${isOriginal ? '🟢 ORIGINAL (mantener)' : '🔴 DUPLICADO (eliminar)'}: ${item.id}`);
          console.log(`      📝 Nombre original: "${item.originalProject}"`);
          console.log(`      📅 Creado: ${new Date(item.createdAt).toLocaleString()}`);
          console.log(`      📝 Actualizado: ${new Date(item.updatedAt).toLocaleString()}`);
          console.log(`      🖼️  Thumbnail: ${item.hasThumbnail ? 'SÍ' : 'NO'}`);
          console.log(`      🎬 Vimeo: ${item.vimeoId}`);
          console.log(`      🏢 Company: ${item.company}`);
          console.log(`      📊 Versión: ${item.version}`);
          console.log(`      📍 Estado: ${item.publishedVersion ? 'PUBLICADO' : 'DRAFT'}`);
          
          if (!isOriginal) {
            // Análisis de qué hacer con el duplicado
            const original = group.items[0];
            if (item.hasThumbnail && !original.hasThumbnail) {
              console.log(`      🔄 ACCIÓN: Transferir thumbnail a original antes de eliminar`);
            }
            if (item.vimeoId !== 'Sin vimeo' && original.vimeoId === 'Sin vimeo') {
              console.log(`      🔄 ACCIÓN: Transferir vimeoId a original antes de eliminar`);
            }
          }
        });
      });
      
      return duplicateGroups; // Retornar para usar en limpieza
    } else {
      console.log('\n🎉 ¡No se encontraron duplicados! Tu contenido está limpio.');
      return [];
    }
    
  } catch (error) {
    console.error('❌ Error buscando duplicados:', error);
    return [];
  }
}

// Función para calcular similitud entre dos strings
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Algoritmo de distancia de Levenshtein
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  findAllDuplicatesAdvanced();
}

module.exports = { findAllDuplicatesAdvanced, normalizeProjectName }; 