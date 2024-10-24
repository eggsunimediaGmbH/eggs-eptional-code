const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// Define paths to watch, excluding .scss and .ts files
const pathsToWatch = [
    'src/**/*',
    '!src/**/*.scss',
    '!src/**/*.ts'
];

// Function to execute commands
function runCommand(command) {
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error running command: ${command}`);
            console.error(stderr);
        } else {
            console.log(stdout);
        }
    });
}

// Function to copy files maintaining directory structure
function copyFile(src) {
    const relativePath = path.relative(path.join(__dirname, 'src'), src);
    const dest = path.join(__dirname, 'dist', relativePath);
    fs.copy(src, dest, err => {
        if (err) {
            console.error(`Error copying file from ${src} to ${dest}:`, err);
        } else {
            console.log(`File copied from ${src} to ${dest}`);
        }
    });
}

// Function to remove files maintaining directory structure
function removeFile(src) {
    const relativePath = path.relative(path.join(__dirname, 'src'), src);
    const dest = path.join(__dirname, 'dist', relativePath);
    fs.remove(dest, err => {
        if (err) {
            console.error(`Error removing file from ${dest}:`, err);
        } else {
            console.log(`File removed from ${dest}`);
        }
    });
}

// Initialize watcher
const watcher = chokidar.watch(pathsToWatch, {
    persistent: true,
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    ignoreInitial: true
});

// Handle file changes
watcher
    .on('add', path => {
        // console.log(`File ${path} has been added`);
        copyFile(path);
    })
    .on('change', path => {
        // console.log(`File ${path} has been changed`);
        copyFile(path);
    })
    .on('unlink', path => {
        // console.log(`File ${path} has been removed`);
        removeFile(path);
    })
    .on('unlinkDir', path => {
        // console.log(`Directory ${path} has been removed`);
        removeFile(path);
    });
