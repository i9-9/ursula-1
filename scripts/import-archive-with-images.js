// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: '.env.local' });

const contentfulManagement = require('contentful-management');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuración
const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

const client = contentfulManagement.createClient({
  accessToken: ACCESS_TOKEN,
});

// Función para convertir URL de Google Drive a formato de descarga directa
function convertGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // Extraer ID del archivo de Google Drive
  const driveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  // Si no es de Google Drive, devolver la URL original
  return url;
}

// Función para descargar imagen desde URL
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    // Convertir URL de Google Drive si es necesario
    const downloadUrl = convertGoogleDriveUrl(url);
    
    if (!downloadUrl) {
      reject(new Error('Invalid URL'));
      return;
    }
    
    console.log(`Downloading from: ${downloadUrl}`);
    
    const protocol = downloadUrl.startsWith('https:') ? https : http;
    const file = fs.createWriteStream(filename);
    
    const request = protocol.get(downloadUrl, (response) => {
      // Manejar redirecciones (común con Google Drive)
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`Redirecting to: ${redirectUrl}`);
        downloadImage(redirectUrl, filename)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filename);
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode} - ${response.statusMessage}`));
      }
    });
    
    request.on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
    
    // Timeout después de 30 segundos
    request.setTimeout(30000, () => {
      request.destroy();
      fs.unlink(filename, () => {});
      reject(new Error('Download timeout'));
    });
  });
}

// Función para obtener el tipo MIME desde la URL o usar JPG por defecto
function getMimeTypeFromUrl(url) {
  if (!url) return 'image/jpeg';
  
  const ext = path.extname(url.split('?')[0]).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo'
  };
  
  return mimeTypes[ext] || 'image/jpeg'; // Por defecto JPG
}

// Función para subir imagen a Contentful
async function uploadImageToContentful(space, environment, imageUrl, title) {
  try {
    if (!imageUrl || imageUrl === 'LINK' || imageUrl.trim() === '' || imageUrl.includes('undefined')) {
      console.log(`Skipping empty/invalid image URL for: ${title}`);
      return null;
    }

    console.log(`📥 Downloading image for ${title}`);
    console.log(`URL: ${imageUrl}`);
    
    // Crear nombre de archivo temporal
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const tempFilename = `temp_${Date.now()}_${sanitizedTitle}.jpg`;
    const tempPath = path.join(__dirname, '..', tempFilename);
    
    // Descargar imagen
    await downloadImage(imageUrl, tempPath);
    
    // Verificar que el archivo se descargó
    if (!fs.existsSync(tempPath)) {
      throw new Error('File was not downloaded successfully');
    }
    
    const stats = fs.statSync(tempPath);
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    console.log(`✅ Downloaded ${stats.size} bytes`);
    
    // Leer archivo
    const imageBuffer = fs.readFileSync(tempPath);
    const contentType = getMimeTypeFromUrl(imageUrl);
    
    console.log(`⬆️ Uploading to Contentful: ${title}`);
    
    // Subir a Contentful Upload API
    const upload = await environment.createUpload({
      file: imageBuffer,
      contentType: contentType,
    });
    
    console.log(`📄 Creating asset: ${title}`);
    
    // Crear asset
    const asset = await environment.createAsset({
      fields: {
        title: {
          'en-US': title
        },
        file: {
          'en-US': {
            contentType: contentType,
            fileName: `${sanitizedTitle}.jpg`,
            uploadFrom: {
              sys: {
                type: 'Link',
                linkType: 'Upload',
                id: upload.sys.id
              }
            }
          }
        }
      }
    });
    
    console.log(`🔄 Processing asset: ${title}`);
    
    // Procesar asset
    await asset.processForAllLocales();
    
    // Esperar un poco más para que se procese
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar que el procesamiento terminó
    let processedAsset = await environment.getAsset(asset.sys.id);
    let attempts = 0;
    while (!processedAsset.fields.file['en-US'].url && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      processedAsset = await environment.getAsset(asset.sys.id);
      attempts++;
    }
    
    // Publicar asset
    const publishedAsset = await processedAsset.publish();
    
    // Limpiar archivo temporal
    fs.unlinkSync(tempPath);
    
    console.log(`🎉 Asset uploaded and published successfully: ${title}`);
    return publishedAsset;
    
  } catch (error) {
    console.error(`❌ Error uploading image for ${title}:`, error.message);
    
    // Limpiar archivo temporal si existe
    try {
      const tempFilename = `temp_${Date.now()}_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      const tempPath = path.join(__dirname, '..', tempFilename);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch {}
    
    return null;
  }
}

// Función para crear entrada de archivo
async function createArchiveItem(space, environment, data, imageAsset, videoAsset) {
  try {
    const fields = {
      project: { 'en-US': data.project || '' },
      year: { 'en-US': String(data.year) || new Date().getFullYear() },
      company: { 'en-US': data.company || '' }
    };

    // Agregar imagen si existe
    if (imageAsset) {
      fields.thumbnail = {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: imageAsset.sys.id
          }
        }
      };
    }

    // Agregar video si existe (usar fullImage para videos también)
    if (videoAsset) {
      fields.fullImage = {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: videoAsset.sys.id
          }
        }
      };
    }

    const entry = await environment.createEntry('archiveItem', { fields });
    const publishedEntry = await entry.publish();
    
    console.log(`✅ Created archive item: ${data.project}`);
    return publishedEntry;
    
  } catch (error) {
    console.error(`❌ Error creating archive item ${data.project}:`, error.message);
    return null;
  }
}

// Función principal
async function importArchive() {
  try {
    console.log('🚀 Starting archive import with images from Google Drive...');
    
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    
    const csvFile = 'archive-data.csv';
    if (!fs.existsSync(csvFile)) {
      throw new Error(`CSV file not found: ${csvFile}\nPlease export your Google Sheets as CSV and save it as '${csvFile}' in the project root.`);
    }

    const results = [];
    
    // Leer CSV con headers custom para manejar la estructura específica
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFile)
        .pipe(csv({
          headers: ['VIDEO', 'FOTO', 'ARTISTA', 'NOMBRE_DEL_TEMA', 'AÑO', 'PRODUCTION_COMPANY', 'EXTRA1', 'EXTRA2', 'EXTRA3'],
          skipEmptyLines: true
        }))
        .on('data', (data) => {
          // Solo agregar filas que no estén completamente vacías
          const hasContent = Object.values(data).some(val => val && val.trim() !== '');
          if (hasContent) {
            results.push(data);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`📖 Found ${results.length} rows in CSV`);
    
    // Mostrar headers para debug
    if (results.length > 0) {
      console.log('📋 CSV Headers:', Object.keys(results[0]));
    }
    
    // Organizar por secciones
    const sections = {
      'MUSIC VIDEO': [],
      'COMMERCIAL': [],
      'SET DESIGN': [],
      'FILM': []
    };
    
    let currentSection = '';
    
    for (const [index, row] of results.entries()) {
      // Detectar headers de sección como 'MUSIC VIDEO', 'COMMERCIAL', etc.
      // Estos aparecen en la columna ARTISTA según la estructura del CSV
      if (row.ARTISTA && ['MUSIC VIDEO', 'COMMERCIAL', 'SET DESIGN', 'FILM'].includes(row.ARTISTA.trim())) {
        currentSection = row.ARTISTA.trim();
        console.log(`📁 Found section: ${currentSection}`);
        continue;
      }
      
      // Saltar filas que son headers de columnas
      if (row.ARTISTA === 'ARTISTA' || row.FOTO === 'FOTO') {
        continue;
      }
      
      // Procesar filas de datos válidas
      if (currentSection && row.ARTISTA && row.ARTISTA.trim() !== '' && row.NOMBRE_DEL_TEMA) {
        
        const item = {
          section: currentSection,
          videoUrl: row.VIDEO || '',
          imageUrl: row.FOTO || '',
          artist: row.ARTISTA || '',
          name: row.NOMBRE_DEL_TEMA || '',
          year: row.AÑO || '',
          company: row.PRODUCTION_COMPANY || '',
          realUrl: ''
        };
        
        // Buscar URL de Google Drive en cualquier columna
        const allValues = Object.values(row);
        for (const value of allValues) {
          if (value && value.includes('drive.google.com/file/d/')) {
            item.realUrl = value;
            break;
          }
        }
        
        sections[currentSection].push(item);
        console.log(`➕ Added item: ${item.artist} - ${item.name} (Row ${index + 1})`);
        console.log(`   📎 URL found: ${item.realUrl ? 'YES' : 'NO'}`);
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 Summary:');
    for (const [sectionName, items] of Object.entries(sections)) {
      console.log(`  ${sectionName}: ${items.length} items`);
    }
    
    // Procesar cada sección
    for (const [sectionName, items] of Object.entries(sections)) {
      if (items.length === 0) continue;
      
      console.log(`\n🎬 Processing section: ${sectionName} (${items.length} items)`);
      
      const sectionItems = [];
      
      for (const [index, item] of items.entries()) {
        console.log(`\n📽️ Processing ${index + 1}/${items.length}: ${item.artist} - ${item.name}`);
        
        // Subir imagen si existe URL real
        let imageAsset = null;
        // TODO: Temporalmente desactivado - las imágenes de Google Drive necesitan permisos especiales
        /*
        if (item.realUrl && item.realUrl.includes('drive.google.com')) {
          console.log(`🖼️ Processing image: ${item.realUrl}`);
          imageAsset = await uploadImageToContentful(
            space, 
            environment, 
            item.realUrl, 
            `${item.artist} - ${item.name} - Photo`
          );
          
          // Esperar entre uploads para no sobrecargar la API
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        */
        
        if (item.realUrl) {
          console.log(`📎 Image URL found (skipped): ${item.realUrl}`);
        }
        
        // Crear entrada
        const archiveItem = await createArchiveItem(space, environment, {
          project: `${item.artist} - ${item.name}`,
          year: String(item.year),
          company: item.company
        }, imageAsset, null);
        
        if (archiveItem) {
          sectionItems.push({
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: archiveItem.sys.id
            }
          });
        }
        
        // Pausa entre elementos
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Crear sección
      if (sectionItems.length > 0) {
        try {
          console.log(`📂 Creating section: ${sectionName} with ${sectionItems.length} items`);
          
          const section = await environment.createEntry('archiveSection', {
            fields: {
              title: { 'en-US': sectionName },
              items: { 'en-US': sectionItems },
              order: { 'en-US': String(Object.keys(sections).indexOf(sectionName) + 1) }
            }
          });
          
          await section.publish();
          console.log(`✅ Created section: ${sectionName} with ${sectionItems.length} items`);
          
        } catch (error) {
          console.error(`❌ Error creating section ${sectionName}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Import completed successfully!');
    console.log('🌐 You can now check your Contentful space to see all the imported content.');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    console.error('\n🔧 Make sure:');
    console.error('1. Your CSV file is saved as "archive-data.csv" in the project root');
    console.error('2. Your .env.local file contains the correct Contentful credentials');
    console.error('3. The images in Google Drive are set to "Anyone with the link can view"');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  importArchive();
}

module.exports = { importArchive }; 