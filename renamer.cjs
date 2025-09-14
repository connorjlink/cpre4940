const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, 'docs', 'temp');
const docsDir = path.join(__dirname, 'docs');

if (fs.existsSync(tempDir)) {
    fs.readdirSync(tempDir).forEach(file => {
        if (file.endsWith('.html')) {
            fs.renameSync(
                path.join(tempDir, file),
                path.join(docsDir, file)
            );
        }
    });
    fs.rmSync(tempDir, { recursive: true });
}
