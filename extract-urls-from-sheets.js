/**
 * GOOGLE APPS SCRIPT para extraer URLs de hipervínculos
 * 
 * INSTRUCCIONES:
 * 1. Abre tu Google Sheets
 * 2. Ve a Extensions > Apps Script
 * 3. Pega este código
 * 4. Ejecuta la función extractHyperlinkUrls()
 * 5. Se crearán nuevas columnas con las URLs reales
 */

function extractHyperlinkUrls() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange();
  const values = data.getValues();
  const richTextValues = data.getRichTextValues();
  
  // Encontrar la última columna con datos
  let lastCol = 0;
  for (let row = 0; row < values.length; row++) {
    for (let col = 0; col < values[row].length; col++) {
      if (values[row][col] !== '') {
        lastCol = Math.max(lastCol, col);
      }
    }
  }
  
  // Agregar headers para las nuevas columnas
  sheet.getRange(3, lastCol + 2).setValue('VIDEO_URL');
  sheet.getRange(3, lastCol + 3).setValue('FOTO_URL');
  
  // Procesar cada fila
  for (let row = 4; row < values.length; row++) { // Comenzar desde fila 5 (índice 4)
    const videoCell = richTextValues[row][0]; // Columna A (VIDEO)
    const fotoCell = richTextValues[row][1];  // Columna B (FOTO)
    
    // Extraer URL del video
    if (videoCell && videoCell.getLinkUrl) {
      const videoUrl = videoCell.getLinkUrl();
      if (videoUrl) {
        sheet.getRange(row + 1, lastCol + 2).setValue(videoUrl);
      }
    }
    
    // Extraer URL de la foto
    if (fotoCell && fotoCell.getLinkUrl) {
      const fotoUrl = fotoCell.getLinkUrl();
      if (fotoUrl) {
        sheet.getRange(row + 1, lastCol + 3).setValue(fotoUrl);
      }
    }
  }
  
  console.log('URLs extraídas exitosamente');
  SpreadsheetApp.getUi().alert('URLs extraídas exitosamente en las nuevas columnas');
}

/**
 * Función alternativa que extrae URLs de toda la hoja
 */
function extractAllHyperlinks() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange();
  const richTextValues = data.getRichTextValues();
  
  // Crear nueva hoja para los resultados
  const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('URLs_Extraidas');
  
  // Headers
  newSheet.getRange(1, 1).setValue('Fila');
  newSheet.getRange(1, 2).setValue('Columna');
  newSheet.getRange(1, 3).setValue('Texto');
  newSheet.getRange(1, 4).setValue('URL');
  
  let resultRow = 2;
  
  // Recorrer todas las celdas
  for (let row = 0; row < richTextValues.length; row++) {
    for (let col = 0; col < richTextValues[row].length; col++) {
      const cell = richTextValues[row][col];
      
      if (cell && cell.getLinkUrl) {
        const url = cell.getLinkUrl();
        if (url) {
          newSheet.getRange(resultRow, 1).setValue(row + 1);
          newSheet.getRange(resultRow, 2).setValue(String.fromCharCode(65 + col));
          newSheet.getRange(resultRow, 3).setValue(cell.getText());
          newSheet.getRange(resultRow, 4).setValue(url);
          resultRow++;
        }
      }
    }
  }
  
  SpreadsheetApp.getUi().alert('URLs extraídas en la nueva hoja "URLs_Extraidas"');
} 