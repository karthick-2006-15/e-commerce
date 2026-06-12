const fs = require('fs');

const emojiMap = {
  '🛒': '<i class="ph ph-shopping-cart"></i>',
  '🏠': '<i class="ph ph-house"></i>',
  '📖': '<i class="ph ph-book-open"></i>',
  '📞': '<i class="ph ph-phone"></i>',
  '📦': '<i class="ph ph-package"></i>',
  '👤': '<i class="ph ph-user"></i>',
  '🔍': '<i class="ph ph-magnifying-glass"></i>',
  '❤️': '<i class="ph ph-heart"></i>',
  '💝': '<i class="ph ph-gift"></i>',
  '🎉': '<i class="ph ph-confetti"></i>',
  '✨': '<i class="ph ph-sparkle"></i>',
  '📍': '<i class="ph ph-map-pin"></i>',
  '✉️': '<i class="ph ph-envelope"></i>',
  '🕐': '<i class="ph ph-clock"></i>',
  '📘': '<i class="ph ph-facebook-logo"></i>',
  '📸': '<i class="ph ph-instagram-logo"></i>',
  '🐦': '<i class="ph ph-twitter-logo"></i>',
  '🔒': '<i class="ph ph-lock-key"></i>',
  '🚚': '<i class="ph ph-truck"></i>',
  '✅': '<i class="ph ph-check-circle"></i>',
  '❌': '<i class="ph ph-x-circle"></i>',
  '🏆': '<i class="ph ph-trophy"></i>',
  '🌾': '<i class="ph ph-plant"></i>',
  '🏭': '<i class="ph ph-factory"></i>',
  '🎁': '<i class="ph ph-gift"></i>',
  '🔐': '<i class="ph ph-lock-key"></i>',
  '👋': '<i class="ph ph-hand-waving"></i>',
  '🧪': '<i class="ph ph-flask"></i>',
  '♻️': '<i class="ph ph-recycle"></i>',
  '🤝': '<i class="ph ph-handshake"></i>',
  '🏅': '<i class="ph ph-medal"></i>',
  '👨‍🍳': '<i class="ph ph-chef-hat"></i>',
  '💳': '<i class="ph ph-credit-card"></i>',
  '📅': '<i class="ph ph-calendar"></i>',
  '👁️': '<i class="ph ph-eye"></i>',
  '🍿': '<i class="ph ph-popcorn"></i>',
  '🗑️': '<i class="ph ph-trash"></i>',
  '🍪': '<i class="ph ph-cookie"></i>',
  '🥨': '<i class="ph ph-cookie"></i>',
  '🍡': '<i class="ph ph-cookie"></i>',
  '🥣': '<i class="ph ph-bowl-food"></i>',
  '🎂': '<i class="ph ph-cake"></i>',
  '🍰': '<i class="ph ph-cake"></i>'
};

const files = ['frontend/index.html', 'frontend/app.js', 'frontend/admin.html', 'frontend/admin.js'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  for (const [emoji, icon] of Object.entries(emojiMap)) {
    const regex = new RegExp(emoji, 'g');
    content = content.replace(regex, icon);
  }

  // Inject phosphor icons script into head if not present
  if (file.endsWith('.html') && !content.includes('@phosphor-icons/web')) {
    content = content.replace('</head>', '  <script src="https://unpkg.com/@phosphor-icons/web"></script>\n</head>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
