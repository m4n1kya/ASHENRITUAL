const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function execGit(msg, file) {
    try {
        execSync(`git add "${file}"`);
        execSync(`git commit -m "${msg}"`);
        console.log(`Committed: ${msg}`);
    } catch (e) {
        console.error(`Failed to commit ${file}: ${e.message}`);
    }
}

function createFile(filePath, content, msg) {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullPath, content);
        execGit(msg, filePath);
    } catch(e) {
        console.error(e.message);
    }
}

console.log("Starting 6 Additional Meaningful Commits...");

createFile('.editorconfig', 'root = true\n\n[*]\ncharset = utf-8\nindent_style = space\nindent_size = 2\nend_of_line = lf\ninsert_final_newline = true\ntrim_trailing_whitespace = true\n', 'Build: Add .editorconfig to standardize editor settings across IDEs');

createFile('.nvmrc', '20.10.0\n', 'Build: Add .nvmrc specifying Node v20 for consistent local environments');

createFile('frontend/.nvmrc', '20.10.0\n', 'Build(frontend): Add explicit .nvmrc for frontend Vercel deployments');

createFile('backend/.nvmrc', '20.10.0\n', 'Build(backend): Add explicit .nvmrc for backend Render deployments');

createFile('.github/workflows/ci.yml', 'name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: echo "CI pipeline initialized"\n', 'CI: Initialize base GitHub Actions workflow for future pipeline automation');

createFile('CONTRIBUTING.md', '# Contributing to ASHENRITUAL\n\n1. Ensure you use Node v20.\n2. Run `npm run lint` before committing.\n', 'Docs: Add CONTRIBUTING.md guidelines for repository maintainers');

try {
    console.log("Pushing 6 meaningful commits to GitHub...");
    execSync('git push', { stdio: 'inherit' });
    console.log("Pushed successfully!");
} catch(e) {
    console.error("Push failed: ", e.message);
}
