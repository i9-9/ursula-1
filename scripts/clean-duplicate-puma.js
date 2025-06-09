/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const contentful = require('contentful-management');
require('dotenv').config({ path: '.env.local' });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

async function cleanDuplicatePuma() {
  try {
    console.log('🧹 LIMPIANDO DUPLICADO DE PUMA');
    console.log('==============================');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    // Los IDs que encontramos
    const pumaCorrect = '7rZXdAe1jhK1g8gSQMpKz3'; // "PUMA - FASHION WEEK" (sin espacio)
    const pumaDuplicate = '17RtUwT1kpiI3LFgrksvSB'; // "PUMA - FASHION WEEK " (con espacio)
    
    console.log('🔍 Obteniendo entradas de PUMA...');
    
    // Obtener ambas entradas
    const correctEntry = await environment.getEntry(pumaCorrect);
    const duplicateEntry = await environment.getEntry(pumaDuplicate);
    
    console.log('\n📋 COMPARACIÓN:');
    console.log('================');
    console.log(`🟢 MANTENER - ID: ${correctEntry.sys.id}`);
    console.log(`   📝 Nombre: "${correctEntry.fields.project['en-US']}"`);
    console.log(`   📅 Creado: ${new Date(correctEntry.sys.createdAt).toLocaleString()}`);
    console.log(`   🖼️  Thumbnail: ${correctEntry.fields.thumbnail ? 'SÍ' : 'NO'}`);
    console.log(`   📊 Versión: ${correctEntry.sys.version}`);
    
    console.log(`\n🔴 ELIMINAR - ID: ${duplicateEntry.sys.id}`);
    console.log(`   📝 Nombre: "${duplicateEntry.fields.project['en-US']}"`);
    console.log(`   📅 Creado: ${new Date(duplicateEntry.sys.createdAt).toLocaleString()}`);
    console.log(`   🖼️  Thumbnail: ${duplicateEntry.fields.thumbnail ? 'SÍ' : 'NO'}`);
    console.log(`   📊 Versión: ${duplicateEntry.sys.version}`);
    
    // Verificar si ambos tienen thumbnails
    const correctHasThumbnail = !!(correctEntry.fields.thumbnail && correctEntry.fields.thumbnail['en-US']);
    const duplicateHasThumbnail = !!(duplicateEntry.fields.thumbnail && duplicateEntry.fields.thumbnail['en-US']);
    
    console.log('\n⚙️  ANÁLISIS:');
    console.log('==============');
    console.log(`✅ Entrada correcta tiene thumbnail: ${correctHasThumbnail}`);
    console.log(`⚠️  Entrada duplicada tiene thumbnail: ${duplicateHasThumbnail}`);
    
    if (duplicateHasThumbnail && !correctHasThumbnail) {
      console.log('\n🔄 TRANSFERIR THUMBNAIL:');
      console.log('========================');
      console.log('El duplicado tiene thumbnail pero el original no.');
      console.log('Transfiriendo thumbnail del duplicado al original...');
      
      // Transferir el thumbnail
      correctEntry.fields.thumbnail = duplicateEntry.fields.thumbnail;
      
      // Actualizar la entrada correcta
      const updatedCorrect = await correctEntry.update();
      await updatedCorrect.publish();
      
      console.log('✅ Thumbnail transferido exitosamente');
    } else if (correctHasThumbnail) {
      console.log('✅ La entrada correcta ya tiene thumbnail, no es necesario transferir');
    }
    
    console.log('\n🗑️  ELIMINANDO DUPLICADO:');
    console.log('=========================');
    
    // Despublicar primero
    if (duplicateEntry.sys.publishedVersion) {
      console.log('📤 Despublicando entrada duplicada...');
      await duplicateEntry.unpublish();
      console.log('✅ Entrada despublicada');
    }
    
    // Ahora eliminar
    console.log('🗑️  Eliminando entrada duplicada...');
    await duplicateEntry.delete();
    console.log('✅ Entrada duplicada eliminada exitosamente');
    
    console.log('\n🎉 LIMPIEZA COMPLETADA');
    console.log('======================');
    console.log('✅ Duplicado eliminado');
    console.log('✅ Entrada original conservada');
    console.log('✅ Thumbnail preservado');
    console.log('\n🔗 Recarga Contentful para ver los cambios');
    
  } catch (error) {
    console.error('❌ Error limpiando duplicado:', error);
    console.error('Detalles:', error.message);
  }
}

cleanDuplicatePuma(); 