const fs = require('fs');
const path = require('path');

// Function to recursively add .js extension to all JavaScript files in a directory
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
