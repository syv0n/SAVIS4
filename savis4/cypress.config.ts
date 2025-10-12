import { defineConfig } from 'cypress';
import * as fs from 'fs';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // ADD THIS TASK FOR VERIFYING DOWNLOADS
      on('task', {
        checkFileExists(filePath) {
          return new Promise((resolve, reject) => {
            if (fs.existsSync(filePath)) {
              resolve(true);
            } else {
              // Retry logic to give the file time to download
              setTimeout(() => {
                if (fs.existsSync(filePath)) {
                  resolve(true);
                } else {
                  reject(new Error(`File not found: ${filePath}`));
                }
              }, 2000); // Wait up to 2 seconds
            }
          });
        },
      });
    },
  },
});