const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {

  execSync('npm run build:prod', { stdio: 'inherit' });
  
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}