const fs = require('fs');
const path = require('path');

function refactorFile(htmlPath, cssPath, jsPath, cssLink, jsLink) {
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Extract CSS
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    fs.writeFileSync(cssPath, styleMatch[1].trim());
    html = html.replace(/<style>[\s\S]*?<\/style>/, `<link rel="stylesheet" href="${cssLink}">`);
  }

  // Extract JS (ignoring the razorpay script tag)
  // We want the script tag that does NOT have a src attribute.
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    let jsContent = scriptMatch[1].trim();

    // Fix API_BASE
    // Replace const API_BASE_URL = '...'; const API_BASE = ...;
    // Or const API_BASE = '...';
    jsContent = jsContent.replace(
      /const API_BASE_URL\s*=\s*['"][^'"]+['"];\nconst API_BASE\s*=\s*API_BASE_URL \+ '\/api';/,
      `const API_BASE = window.location.origin + '/api';`
    );
    jsContent = jsContent.replace(
      /const API_BASE\s*=\s*['"]https:\/\/e-commerce-1-m0mc\.onrender\.com\/api['"];/,
      `const API_BASE = window.location.origin + '/api';`
    );

    // Write JS
    fs.writeFileSync(jsPath, jsContent);
    html = html.replace(/<script>[\s\S]*?<\/script>/, `<script src="${jsLink}"></script>`);
  }

  // Write HTML back
  fs.writeFileSync(htmlPath, html);
}

const frontendDir = path.join(__dirname, '../frontend');

refactorFile(
  path.join(frontendDir, 'swamy-bakery.html'),
  path.join(frontendDir, 'styles.css'),
  path.join(frontendDir, 'app.js'),
  '/styles.css',
  '/app.js'
);

refactorFile(
  path.join(frontendDir, 'admin.html'),
  path.join(frontendDir, 'admin.css'),
  path.join(frontendDir, 'admin.js'),
  '/admin.css',
  '/admin.js'
);

// Rename swamy-bakery.html to index.html
fs.renameSync(
  path.join(frontendDir, 'swamy-bakery.html'),
  path.join(frontendDir, 'index.html')
);

console.log('Refactoring complete!');
