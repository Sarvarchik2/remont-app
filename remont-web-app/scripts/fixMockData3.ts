import fs from 'fs';
import path from 'path';

const filePath = path.resolve(__dirname, '../src/utils/mockData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Function to translate string values
function toTrilingual(str: string, isUnit = false) {
    // Simple translation logic for units
    if (isUnit) {
        if (str === 'сум/м²') return `{ ru: '${str}', uz: 'so\\'m/m²', en: 'sum/m²' }`;
        if (str === 'сум/шт') return `{ ru: '${str}', uz: 'so\\'m/dona', en: 'sum/pc' }`;
        if (str === 'сум/п.м') return `{ ru: '${str}', uz: 'so\\'m/p.m', en: 'sum/l.m' }`;
    }

    // Clean up single quotes inside strings
    const cleanStr = str.replace(/'/g, "\\'");

    // Basic mock translations based on Russian
    return `{ ru: '${cleanStr}', uz: '${cleanStr} (uz)', en: '${cleanStr} (en)' }`;
}

// 1. Convert MOCK_SERVICES categories and services
content = content.replace(/title:\s*'([^']+)'/g, (match, p1) => `title: ${toTrilingual(p1)}`);
content = content.replace(/name:\s*'([^']+)'/g, (match, p1) => `name: ${toTrilingual(p1)}`);
content = content.replace(/unit:\s*'([^']+)'/g, (match, p1) => `unit: ${toTrilingual(p1, true)}`);

// 2. Convert MOCK_PORTFOLIO items
content = content.replace(/(description):\s*'([^']+)'/g, (match, p1, p2) => `${p1}: ${toTrilingual(p2)}`);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated mockData.ts with trilingual objects.');
