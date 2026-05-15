import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { body, validationResult } from 'express-validator';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const users = [
  { id: 'u1', name: 'Ankit', email: 'ankit@prepwise.com', password: 'admin123' }
];

function createToken(user: any) {
  return `prepwise-token-${user.id}`;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'PrepWise API' });
});

app.post('/api/auth/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = users.find((item) => item.email === email && item.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    });
  }
);

const server = app.listen(port, () => {
  console.log(`PrepWise API running at http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});