const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, './')
const outputDir = path.resolve(__dirname, 'temp')

const replacements = {
  '<!-- inject:commonHead -->': fs.readFileSync('./partials/commonHead.html', 'utf-8'),
  '<!-- inject:commonHeader -->': fs.readFileSync('./partials/commonHeader.html', 'utf-8'),
  '<!-- inject:commonNavbar -->': fs.readFileSync('./partials/commonNavbar.html', 'utf-8'),
  '<!-- inject:commonFooter -->': fs.readFileSync('./partials/commonFooter.html', 'utf-8'),
}

fs.mkdirSync(outputDir, { recursive: true })

fs.readdirSync(sourceDir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(sourceDir, file), 'utf-8')
        for (const [key, value] of Object.entries(replacements)) {
            content = content.replace(key, value)
        }
        fs.writeFileSync(path.join(outputDir, file), content)
    }
});
