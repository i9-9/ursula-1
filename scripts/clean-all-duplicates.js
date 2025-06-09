/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

// Importar el detector de duplicados
const { findAllDuplicatesAdvanced } = require('./find-all-duplicates-advanced');

async function cleanAllDuplicates() {
  try {
    console.log('🧹 LIMPIEZA AUTOMÁTICA DE DUPLICADOS');
    console.log('====================================');
    
    // Primero encontrar todos los duplicados
    const duplicateGroups = await findAllDuplicatesAdvanced();
    
    if (duplicateGroups.length === 0) {
      console.log('✅ No hay duplicados para limpiar');
      return;
    }
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    console.log(`\n🚀 INICIANDO LIMPIEZA DE ${duplicateGroups.length} GRUPOS DE DUPLICADOS`);
    console.log('================================================================');
    
    let totalCleaned = 0;
    let totalErrors = 0;
    
    for (const group of duplicateGroups) {
      console.log(`\n📁 PROCESANDO GRUPO: "${group.normalizedName}"`);
      console.log('=' .repeat(50));
      
      const original = group.items[0]; // El más antiguo es el original
      const duplicates = group.items.slice(1); // El resto son duplicados
      
      console.log(`🟢 ORIGINAL: ${original.id} - "${original.originalProject}"`);
      console.log(`🔴 DUPLICADOS A ELIMINAR: ${duplicates.length}`);
      
      try {
        // Obtener la entrada original
        const originalEntry = await environment.getEntry(original.id);
        let originalModified = false;
        
        // Procesar cada duplicado
        for (const duplicate of duplicates) {
          console.log(`\n  🔄 Procesando duplicado: ${duplicate.id}`);
          
          try {
            const duplicateEntry = await environment.getEntry(duplicate.id);
            
            // Transferir thumbnail si el original no tiene pero el duplicado sí
            if (duplicate.hasThumbnail && !original.hasThumbnail) {
              console.log(`    🖼️  Transfiriendo thumbnail del duplicado al original...`);
              originalEntry.fields.thumbnail = duplicateEntry.fields.thumbnail;
              originalModified = true;
            }
            
            // Transferir vimeoId si el original no tiene pero el duplicado sí
            if (duplicate.vimeoId !== 'Sin vimeo' && original.vimeoId === 'Sin vimeo') {
              console.log(`    🎬 Transfiriendo vimeoId del duplicado al original...`);
              if (!originalEntry.fields.vimeoId) {
                originalEntry.fields.vimeoId = {};
              }
              originalEntry.fields.vimeoId['en-US'] = duplicate.vimeoId;
              originalModified = true;
            }
            
            // Transferir company si el original no tiene pero el duplicado sí
            if (duplicate.company !== 'Sin company' && original.company === 'Sin company') {
              console.log(`    🏢 Transfiriendo company del duplicado al original...`);
              if (!originalEntry.fields.company) {
                originalEntry.fields.company = {};
              }
              originalEntry.fields.company['en-US'] = duplicate.company;
              originalModified = true;
            }
            
            // Eliminar el duplicado
            console.log(`    🗑️  Eliminando duplicado ${duplicate.id}...`);
            
            // Despublicar si está publicado
            if (duplicate.publishedVersion) {
              await duplicateEntry.unpublish();
              console.log(`    📤 Despublicado`);
            }
            
            // Eliminar
            await duplicateEntry.delete();
            console.log(`    ✅ Eliminado exitosamente`);
            totalCleaned++;
            
          } catch (duplicateError) {
            console.error(`    ❌ Error procesando duplicado ${duplicate.id}:`, duplicateError.message);
            totalErrors++;
          }
        }
        
        // Actualizar el original si fue modificado
        if (originalModified) {
          console.log(`  🔄 Actualizando entrada original...`);
          const updatedOriginal = await originalEntry.update();
          await updatedOriginal.publish();
          console.log(`  ✅ Original actualizado y publicado`);
        }
        
        console.log(`  🎉 Grupo "${group.normalizedName}" limpiado exitosamente`);
        
      } catch (groupError) {
        console.error(`  ❌ Error procesando grupo "${group.normalizedName}":`, groupError.message);
        totalErrors++;
      }
    }
    
    // RESUMEN FINAL
    console.log('\n🎉 LIMPIEZA COMPLETADA');
    console.log('======================');
    console.log(`✅ Duplicados eliminados: ${totalCleaned}`);
    console.log(`❌ Errores: ${totalErrors}`);
    console.log(`📁 Grupos procesados: ${duplicateGroups.length}`);
    
    if (totalCleaned > 0) {
      console.log('\n🌟 Tu contenido ahora está limpio de duplicados!');
      console.log('🔗 Recarga Contentful para ver los cambios');
      
      // Verificar el resultado final
      console.log('\n🔍 Verificando resultado...');
      const finalDuplicates = await findAllDuplicatesAdvanced();
      if (finalDuplicates.length === 0) {
        console.log('✅ ¡Verificación exitosa! No quedan duplicados.');
      } else {
        console.log(`⚠️  Aún quedan ${finalDuplicates.length} grupos de duplicados por revisar.`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en limpieza automática:', error);
  }
}

cleanAllDuplicates(); 