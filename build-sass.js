const sass = require('sass');
const fs = require('fs');
const path = require('path');

function compileSassFile(srcFilePath, distFilePath) {
  // Ensure the directory for the destination file exists
  const distFileDir = path.dirname(distFilePath);
  if (!fs.existsSync(distFileDir)) {
    fs.mkdirSync(distFileDir, { recursive: true });
    console.log(`Created directory: ${distFileDir}`);
  }

  // Compile the Sass file
  const result = sass.compile(srcFilePath, { style: 'expanded' });

  // Write the compiled CSS to the destination file
  fs.writeFileSync(distFilePath, result.css);
  console.log(`Compiled ${srcFilePath} to ${distFilePath}`);
}

function compileDirectory(srcBaseDir, distBaseDir) {
  fs.readdirSync(srcBaseDir, { withFileTypes: true }).forEach((dirent) => {
    const srcFullPath = path.join(srcBaseDir, dirent.name);
    const distFullPath = srcFullPath.replace(srcBaseDir, distBaseDir).replace(/\.scss$/, '.css');

    if (dirent.isDirectory()) {
      // Recursively handle directories
      compileDirectory(srcFullPath, distFullPath);
    } else if (dirent.isFile() && path.extname(dirent.name) === '.scss') {
      // Compile .scss files
      compileSassFile(srcFullPath, distFullPath);
    }
  });
}

const baseSrcDir = path.join(__dirname, 'src');
const baseDistDir = path.join(__dirname, 'dist');
compileDirectory(baseSrcDir, baseDistDir);

console.log('SASS compilation complete.');
