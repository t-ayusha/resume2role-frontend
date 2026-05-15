import express from 'express';
import cors from 'cors';

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());

const users = [
  { id: 'u1', name: 'Ankit', email: 'ankit@prepwise.com', password: 'admin123' }
];

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/login', (req, res) => {
  console.log('Received login request:', req.body);
  const { email, password } = req.body;
  const user = users.find((item) => item.email === email && item.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return res.json({
    token: `prepwise-token-${user.id}`,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});