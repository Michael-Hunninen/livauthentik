const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure the public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple placeholder image
function createPlaceholderImage(width, height, text, bgColor, textColor) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = textColor;
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toBuffer();
}

// Create the fitness directory if it doesn't exist
const fitnessDir = path.join(__dirname, '../public/images/fitness');
if (!fs.existsSync(fitnessDir)) {
  fs.mkdirSync(fitnessDir, { recursive: true });
}

// Create placeholder images
const placeholders = [
  { name: 'strength.jpg', text: 'STRENGTH' },
  { name: 'cardio.jpg', text: 'CARDIO' },
  { name: 'yoga.jpg', text: 'YOGA' },
];

placeholders.forEach(({ name, text }) => {
  const filePath = path.join(fitnessDir, name);
  if (!fs.existsSync(filePath)) {
    const imageBuffer = createPlaceholderImage(800, 600, text, '#f0f0f0', '#333');
    fs.writeFileSync(filePath, imageBuffer);
    console.log(`Created placeholder: ${filePath}`);
  } else {
    console.log(`Skipping existing: ${filePath}`);
  }
});

console.log('Done!');
