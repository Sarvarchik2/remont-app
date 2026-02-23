import fs from 'fs';
import path from 'path';

const mockDataPath = path.join(__dirname, '../src/utils/mockData.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// Replace multi-line object blocks specifically for descriptions in MOCK_CATALOG
content = content.replace(
    /description: {\s*ru: ('.*?'),\s*uz: ('.*?')\s*}/gs,
    (match, ru, uz) => `description: {\n      ru: ${ru},\n      uz: ${uz},\n      en: ${ru}\n    }`
);

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log('mockData.ts updated multi-line descriptions with english fallback values!');
