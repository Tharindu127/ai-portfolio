#!/usr/bin/env node
/**
 * Updates all HTML files to:
 * 1. Wrap <img> tags referencing .png files into <picture> elements with WebP sources
 * 2. Add loading="lazy" to all images except the first visible one per page
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Find all HTML files
function findHtmlFiles(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules') {
            results.push(...findHtmlFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

function processHtml(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    let imgCount = 0;
    let changedCount = 0;

    // Match <img> tags that reference .png files and are NOT already inside <picture>
    // This regex handles multiline img tags
    const imgRegex = /<img\b([^>]*?)src=["']([^"']*\.png)["']([^>]*?)>/gi;

    // First check if file already has <picture> wrapping
    if (html.includes('<picture>')) {
        console.log(`  ⏭️  ${path.basename(filePath)} — already has <picture> tags, skipping`);
        return { total: 0, changed: 0 };
    }

    const newHtml = html.replace(imgRegex, (match, before, src, after) => {
        imgCount++;

        // Generate WebP source path
        const webpSrc = src.replace(/\.png$/i, '.webp');

        // Check if lazy loading should be added
        // First image on the page (or hero images) should NOT be lazy
        const isFirst = imgCount === 1;
        const hasLazy = match.includes('loading=');

        // Build new img tag with lazy loading
        let imgTag = match;
        if (!hasLazy && !isFirst) {
            // Add loading="lazy" before the closing >
            imgTag = imgTag.replace(/>$/, ' loading="lazy">');
        }

        changedCount++;

        // Wrap in <picture> with WebP source
        return `<picture>\n                    <source srcset="${webpSrc}" type="image/webp">\n                    ${imgTag}\n                </picture>`;
    });

    if (changedCount > 0) {
        fs.writeFileSync(filePath, newHtml, 'utf-8');
        console.log(`  ✅ ${path.basename(filePath)} — ${changedCount} images wrapped in <picture> with WebP`);
    } else {
        console.log(`  ℹ️  ${path.basename(filePath)} — no PNG images found`);
    }

    return { total: imgCount, changed: changedCount };
}

// Main
console.log('🔧 Updating HTML files with <picture> tags and lazy loading...\n');

const htmlFiles = findHtmlFiles(ROOT);
let totalImages = 0;
let totalChanged = 0;

for (const file of htmlFiles) {
    const result = processHtml(file);
    totalImages += result.total;
    totalChanged += result.changed;
}

console.log(`\n📊 Summary: ${totalChanged} images updated across ${htmlFiles.length} HTML files`);
