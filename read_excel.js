import * as XLSX from 'xlsx';
import * as fs from 'fs';

try {
  const filePath = './todella sample import.xlsx';
  
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist at path: ${filePath}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
  
  console.log('--- WORKBOOK METADATA ---');
  console.log('Sheet Names:', workbook.SheetNames);
  
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  const parsedData = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('\n--- PARSED ROWS (FIRST 5 ROWS) ---');
  console.log(JSON.stringify(parsedData.slice(0, 5), null, 2));
  
  console.log('\n--- HEADERS DETECTED ---');
  if (parsedData.length > 0) {
    console.log(Object.keys(parsedData[0]));
  } else {
    console.log('No rows detected.');
  }
} catch (error) {
  console.error('Error reading excel file:', error);
}
