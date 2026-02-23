import fs from 'fs';
import { resolve } from 'path';
import { register } from 'ts-node';

// Register ts-node to parse TypeScript
register({
    compilerOptions: {
        module: 'commonjs'
    }
});

import {
    MOCK_LEADS,
    INITIAL_CALCULATOR_PRICES,
    STORIES_DATA,
    MOCK_PROJECTS,
    MOCK_PORTFOLIO,
    MOCK_SERVICES,
    MOCK_CATALOG
} from '../src/utils/mockData';

const BASE_URL = 'http://localhost:8000/api/v1';

async function seedData(path: string, items: any[]) {
    try {
        const response = await fetch(`${BASE_URL}/${path}/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items),
        });

        if (response.ok) {
            console.log(`✅ Seeded ${path} successfully (${items.length} items)`);
        } else {
            console.error(`❌ Failed to seed ${path}:`, await response.text());
        }
    } catch (error) {
        console.error(`❌ Fetch error for ${path}:`, error);
    }
}

async function seedSettings() {
    try {
        const response = await fetch(`${BASE_URL}/settings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 1, prices: INITIAL_CALCULATOR_PRICES }),
        });

        if (response.ok) {
            console.log(`✅ Seeded settings successfully`);
        } else {
            console.error(`❌ Failed to seed settings:`, await response.text());
        }
    } catch (e) {
        console.error(`❌ Fetch error for settings:`, e);
    }
}

async function runOptions() {
    console.log('Seeding Database...');
    await seedSettings();
    await seedData('leads', MOCK_LEADS as any);
    await seedData('stories', STORIES_DATA as any);
    await seedData('projects', MOCK_PROJECTS as any);
    await seedData('portfolio', MOCK_PORTFOLIO as any);
    await seedData('services', MOCK_SERVICES as any);
    await seedData('catalog', MOCK_CATALOG as any);
    console.log('Complete!');
}

runOptions();
