import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'public', 'images');
const srcDir = path.join(__dirname, 'src');

const imageExtensions = ['.jpg', '.jpeg', '.png'];

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (imageExtensions.includes(ext)) {
        const webpPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';
        
        console.log(`Converting ${fullPath} to WebP...`);
        try {
          await sharp(fullPath).webp({ quality: 80 }).toFile(webpPath);
          console.log(`Successfully converted ${fullPath}. Deleting original...`);
          fs.unlinkSync(fullPath);
        } catch (error) {
          console.error(`Error converting ${fullPath}:`, error);
        }
      }
    }
  }
}

function processSourceFiles(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processSourceFiles(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.tsx', '.ts', '.css'].includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        // Replace .jpg, .jpeg, .png with .webp
        const regex = /\.((jpg)|(jpeg)|(png))/gi;
        if (regex.test(content)) {
            content = content.replace(regex, '.webp');
            modified = true;
        }

        if (modified) {
          console.log(`Updating references in ${fullPath}`);
          fs.writeFileSync(fullPath, content, 'utf8');
        }
      }
    }
  }
}

async function main() {
  console.log('--- Starting Image Conversion ---');
  await processDirectory(imagesDir);
  console.log('--- Image Conversion Complete ---');

  console.log('--- Starting Code Reference Updates ---');
  processSourceFiles(srcDir);
  console.log('--- Code Reference Updates Complete ---');
}

main().catch(console.error);
