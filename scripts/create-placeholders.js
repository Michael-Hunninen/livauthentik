const fs = require('fs');
const path = require('path');

// Base64 encoded 1x1 transparent PNG
const transparentPixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Create the fitness directory if it doesn't exist
const fitnessDir = path.join(__dirname, '../public/images/fitness');
if (!fs.existsSync(fitnessDir)) {
  fs.mkdirSync(fitnessDir, { recursive: true });
}

// Create placeholder images
const placeholders = [
  'strength.jpg',
  'cardio.jpg',
  'yoga.jpg',
];

placeholders.forEach((filename) => {
  const filePath = path.join(fitnessDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, transparentPixel, 'base64');
    console.log(`Created placeholder: ${filePath}`);
  } else {
    console.log(`Skipping existing: ${filePath}`);
  }
});

console.log('Done!');
