#!/usr/bin/env node
/**
 * Generate a manifest of insight images.
 * Scans public/images/insights/<insight-id>/ folders and creates
 * public/images/insights/manifest.json listing all image files per insight.
 *
 * Usage: node scripts/generate-insight-images.js
 * Or:    npm run gen-images
 */

const fs = require('fs');
const path = require('path');

const INSIGHTS_DIR = path.join(__dirname, '..', 'public', 'images', 'insights');
const MANIFEST_PATH = path.join(INSIGHTS_DIR, 'manifest.json');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];

function generateManifest() {
    const manifest = {};

    if (!fs.existsSync(INSIGHTS_DIR)) {
        fs.mkdirSync(INSIGHTS_DIR, { recursive: true });
    }

    const entries = fs.readdirSync(INSIGHTS_DIR, { withFileTypes: true });

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const folderName = entry.name;
        const folderPath = path.join(INSIGHTS_DIR, folderName);
        const files = fs.readdirSync(folderPath)
            .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
            .sort(); // Sort by filename (alphabetical/numerical order)

        if (files.length > 0) {
            manifest[folderName] = files;
        }
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`✅ Generated manifest with ${Object.keys(manifest).length} insight(s):`);
    for (const [id, files] of Object.entries(manifest)) {
        console.log(`   ${id}: ${files.length} image(s)`);
    }
    if (Object.keys(manifest).length === 0) {
        console.log('   (no images found yet)');
    }
}

generateManifest();
