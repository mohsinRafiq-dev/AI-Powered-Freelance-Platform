const fs = require('fs');
const path = require('path');

const directory = 'c:\\Users\\iamas\\OneDrive\\Desktop\\AI-POWERED FREELANCE MARKETPLACE';
const ignoreDirs = ['node_modules', '.git', 'uploads', 'dist', 'build', '.next'];
const ignoreFiles = ['package-lock.json', 'eng.traineddata'];
const ignoreExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm'];

function walkAndReplace(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                walkAndReplace(fullPath);
            }
        } else {
            if (ignoreFiles.includes(file)) continue;
            const ext = path.extname(file).toLowerCase();
            if (ignoreExts.includes(ext)) continue;
            
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                let newContent = content
                    .replace(/Linkify/g, 'Linkify')
                    .replace(/Linkify/g, 'Linkify')
                    .replace(/linkify/g, 'linkify')
                    .replace(/LINKIFY/g, 'LINKIFY');
                
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            } catch(e) {
                // ignore errors
            }
        }
    }
}

walkAndReplace(directory);
console.log("Done");
