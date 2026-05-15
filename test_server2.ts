import express from 'express';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

console.log('Dotenv loaded, MONGO_URI:', process.env.MONGO_URI || 'NOT SET');

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});