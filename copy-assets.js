const fs = require('fs-extra');
const path = require('path');

// Define source and destination directories
const srcDir = path.join(__dirname, 'src');
const destDir = path.join(__dirname, 'dist');

// File extensions to exclude from the copy process
const excludeExtensions = ['.ts', '.scss', '.json'];

// Copy filter function to exclude specific file types
function copyFilter(src) {
    const extension = path.extname(src);
    return !excludeExtensions.includes(extension);
}

// Copy files and directories excluding the specified file types
fs.copy(srcDir, destDir, { filter: copyFilter }, err => {
    if (err) {
        console.error('An error occurred while copying the assets:', err);
        return;
    }
    console.log('Assets copied successfully!');
});

function addJsExtension(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            addJsExtension(fullPath);  // Recurse into subdirectories
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/from\s+['"]([^'"]+)['"]/g, (match, p1) => {
                if (p1.startsWith('.') && !p1.endsWith('.js')) {
                    return match.replace(p1, `${p1}.js`);
                }
                return match;
            });
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}

// Specify the directory containing the compiled JavaScript files
addJsExtension(path.join(__dirname, 'dist'));
