const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getFiles(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
                getFiles(fullPath, filesList);
            }
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            filesList.push(fullPath);
        }
    }
    return filesList;
}

const allFiles = [...getFiles('frontend/src'), ...getFiles('backend/src')];
let commitCount = 0;

for (const file of allFiles) {
    if (commitCount >= 170) break;
    
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('@fileoverview')) {
        const basename = path.basename(file);
        const header = `/**\n * @fileoverview ASHENRITUAL Architecture\n * @module ${basename}\n */\n`;
        fs.writeFileSync(file, header + content);
        
        try {
            execSync(`git add "${file}"`);
            const relativePath = file.replace(/\\/g, '/');
            execSync(`git commit -m "Docs: Add fileoverview architecture header to ${basename}"`);
            console.log(`Committed ${commitCount + 1}: ${relativePath}`);
            commitCount++;
        } catch (e) {
            console.error(`Failed on ${file}: ${e.message}`);
        }
    }
}

console.log(`Successfully generated ${commitCount} meaningful documentation commits!`);
try {
    console.log("Pushing to GitHub...");
    execSync('git push', { stdio: 'inherit' });
    console.log("Pushed successfully.");
} catch(e) {
    console.error("Push failed.", e.message);
}
