import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Base64 encoded 1x1 transparent PNG
const transparentPixel = 'iVBORw0KGgoAAAANSUhEVgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Create the fitness directory if it doesn't exist
const fitnessDir = join(__dirname, '../public/images/fitness');
if (!existsSync(fitnessDir)) {
  mkdirSync(fitnessDir, { recursive: true });
}

// Create placeholder images
const placeholders = [
  'strength.jpg',
  'cardio.jpg',
  'yoga.jpg',
];

placeholders.forEach((filename) => {
  const filePath = join(fitnessDir, filename);
  if (!existsSync(filePath)) {
    writeFileSync(filePath, transparentPixel, 'base64');
    console.log(`Created placeholder: ${filePath}`);
  } else {
    console.log(`Skipping existing: ${filePath}`);
  }
});

console.log('Done!');
