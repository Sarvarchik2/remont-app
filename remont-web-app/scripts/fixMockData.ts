import fs from 'fs';
import path from 'path';

const mockDataPath = path.join(__dirname, '../src/utils/mockData.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// Replace { ru: '...', uz: '...' } with { ru: '...', uz: '...', en: '...' } using regex
content = content.replace(/{ ru: ('.*?'), uz: ('.*?') }/g, (match, ru, uz) => {
    // Generate a simple English string by removing quotes and appending (EN) for visual testing purposes
    // Or we could translate, but since it's mock data, a placeholder is sufficient for fixing TS
    return `{ ru: ${ru}, uz: ${uz}, en: ${ru} }`;
});

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log('mockData.ts updated with english fallback values!');
