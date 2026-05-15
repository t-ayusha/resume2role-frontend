console.log('About to require index.ts...');
import('./src/server/index.ts').then(() => {
  console.log('index.ts loaded successfully');
}).catch(err => {
  console.error('Failed to load index.ts:', err);
});