import { defineConfig } from 'vite';
import { resolve } from 'path';
import { exec } from 'child_process';
import fs from 'fs';

function getHtmlInputs() {
    const tempDir = resolve(__dirname, 'temp');
    return fs.readdirSync(tempDir)
        .filter(file => file.endsWith('.html'))
        .reduce((inputs, file) => {
            inputs[file] = resolve(tempDir, file);
            return inputs;
        }, {});
}

function InjectorPlugin() {
   return {
      name: 'injector-plugin',
      async handleHotUpdate({ file, server }) {
         if (file.includes('temp')) {
            return;
         }
         if (
            file.endsWith('.html') ||
            file.startsWith(resolve(__dirname, 'partials'))
         ) {
            var hadError = false;

            exec('node injector.cjs', (error, stdout, stderr) => {
               if (error) {
                  console.error(`Injector error: ${error.message}`);
                  hadError = true;
                  return;
               }
               console.log(stdout);
            });

            exec('node renamer.cjs', (error, stdout, stderr) => {
               if (error) {
                  console.error(`Renamer error: ${error.message}`);
                  hadError = true;
                  return;
               }
               console.log(stdout);
            });

            server.ws.send({ type: 'full-reload' });
         }
      }
   };
}

export default defineConfig({
    plugins: [InjectorPlugin()],
    // root: './docs/',
    server: {
        watch: {
            ignored: ['!**/temp/**']
        }
    },
    build: {
        outDir: './docs',
        rollupOptions: {
            input: getHtmlInputs()
        }
    }
});
