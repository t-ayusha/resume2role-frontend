import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import adminPrepRoutes from './routes/adminPrep.js';
import {connectDB} from './config/db';

connectDB()
const app = express();
const port = process.env.PORT || 4000;

// Allow configurable CORS origin for production
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '1mb' }));

// Admin Prep Routes
app.use('/api/admin', adminPrepRoutes);

// Types
interface User {
  id: string;
  name: string;
  email: string;
  /** NOTE: In production, store a bcrypt hash, never plaintext */
  password?: string;
  avatarUrl?: string;
}

interface InterviewBreakdown {
  title: string;
  score: string;
  bullets: string[];
}

interface InterviewReport {
  id: string;
  userId?: string;
  role: string;
  type: string;
  score: number;
  createdAt: string;
  verdict: string;
  overallImpression: string;
  breakdown: InterviewBreakdown[];
}

interface Template {
  _id: string;
  title: string;
  description: string;
  role: string;
  type: string;
  icon: string;
}

// In-memory storage (replace with MongoDB via Mongoose for persistence)
let users: User[] = [];

let interviews: InterviewReport[] = [
  {
    id: 'r1',
    role: 'Frontend Developer',
    type: 'Technical',
    score: 12,
    createdAt: new Date().toISOString(),
    verdict: 'Not Recommended',
    overallImpression: 'Your responses showed intent but lacked structured examples.',
    breakdown: [
      { title: 'Communication Skills', score: '5/20', bullets: ['Responses lacked structure.', 'Examples were limited.'] },
      { title: 'Technical Depth', score: '4/20', bullets: ['Concepts were partially correct.', 'More practical examples needed.'] },
    ],
  },
];

const templates: Template[] = [
  { _id: 't1', title: 'Software Engineer', description: 'General software engineering interview covering data structures, algorithms, and system design.', role: 'Software Engineer', type: 'Technical', icon: '💻' },
  { _id: 't2', title: 'Product Manager', description: 'Focuses on product sense, strategy, and execution for PM roles.', role: 'Product Manager', type: 'Behavioral', icon: '📊' },
  { _id: 't3', title: 'Frontend Developer', description: 'Deep dive into React, CSS, and modern web technologies.', role: 'Frontend Developer', type: 'Technical', icon: '🎨' },
  { _id: 't4', title: 'Backend Developer', description: 'Node.js, databases, REST APIs, and system architecture.', role: 'Backend Developer', type: 'Technical', icon: '⚙️' },
  { _id: 't5', title: 'Data Scientist', description: 'Statistics, ML fundamentals, and practical data analysis.', role: 'Data Scientist', type: 'Technical', icon: '📈' },
  { _id: 't6', title: 'UX Designer', description: 'Design thinking, user research, and portfolio review.', role: 'UX Designer', type: 'Mixed', icon: '🎨' },
];

let performance: number[] = [30, 45, 20, 58, 35, 48, 62];

// Validation middleware
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

function createToken(user: User) {
  return `Resume2Role-token-${user.id}-${Date.now()}`;
}

// Helper: get user from auth header
function getUserFromToken(req: Request): User | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const match = token.match(/^Resume2Role-token-(u\d+)/)
  if (!match) return null;
  return users.find((u) => u.id === match[1]) ?? null;
}

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'Resume2Role API', timestamp: new Date().toISOString() });
});

// Auth Routes
app.post('/api/auth/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
  (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    return res.json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } });
  }
);

app.post('/api/auth/signup',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim(),
  validate,
  (req: Request, res: Response) => {
    const { email, password, name } = req.body as { email: string; password: string; name: string };
    if (users.some((u) => u.email === email)) return res.status(409).json({ message: 'Email already in use' });
    const user: User = { id: `u${users.length + 1}`, name, email, password };
    users.push(user);
    return res.status(201).json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } });
  }
);

app.post('/api/auth/google', (req: Request, res: Response) => {
  const googleEmail = (req.body as { email?: string; name?: string })?.email || 'google.user@Resume2Role.dev';
  const googleName = (req.body as { name?: string })?.name || 'Google User';
  let user = users.find((u) => u.email === googleEmail);
  if (!user) {
    user = { id: `u${users.length + 1}`, name: googleName, email: googleEmail, password: 'google-oauth' };
    users.push(user);
  }
  return res.json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } });
});

// Interview Routes
app.post('/api/interviews/complete', (req: Request, res: Response) => {
  const { role = 'Frontend Developer', type = 'Technical' } = req.body as { role?: string; type?: string };
  const score = Math.max(5, Math.floor(Math.random() * 85) + 10);
  const user = getUserFromToken(req);

  const breakdown: InterviewBreakdown[] = [
    {
      title: 'Communication',
      score: `${Math.min(20, Math.floor(score * 0.2))}/20`,
      bullets: score >= 60
        ? ['Clear and structured answers.', 'Good use of examples.']
        : ['Use STAR format for better structure.', 'Keep answers concise and focused.'],
    },
    {
      title: 'Technical Depth',
      score: `${Math.min(20, Math.floor(score * 0.22))}/20`,
      bullets: score >= 60
        ? ['Strong technical knowledge shown.', 'Good trade-off discussions.']
        : ['Add more real-world project depth.', 'Explain trade-offs more clearly.'],
    },
    {
      title: 'Problem Solving',
      score: `${Math.min(20, Math.floor(score * 0.18))}/20`,
      bullets: score >= 60
        ? ['Methodical approach to problems.', 'Considered edge cases well.']
        : ['Walk through your thinking out loud.', 'Consider multiple approaches.'],
    },
    {
      title: 'Confidence & Delivery',
      score: `${Math.min(20, Math.floor(score * 0.2))}/20`,
      bullets: score >= 60
        ? ['Confident and composed delivery.', 'Good pacing and clarity.']
        : ['Practice breathing between answers.', 'Slow down to improve clarity.'],
    },
  ];

  const report: InterviewReport = {
    id: `r${interviews.length + 1}`,
    userId: user?.id,
    role,
    type,
    score,
    createdAt: new Date().toISOString(),
    verdict: score >= 60 ? 'Recommended' : 'Not Recommended',
    overallImpression: score >= 60
      ? 'Strong performance with clear answers and good communication. Continue refining with quantified examples.'
      : 'Responses need stronger structure, more confidence, and better technical specificity.',
    breakdown,
  };

  interviews.unshift(report);
  performance.push(score);
  if (performance.length > 10) performance.shift();
  return res.status(201).json(report);
});

app.get('/api/interviews/summary', (_req: Request, res: Response) => {
  const total = interviews.length;
  const avg = total ? Math.round(interviews.reduce((sum, i) => sum + i.score, 0) / total) : 0;
  const last = total ? interviews[0].score : 0;
  const recent = interviews.slice(0, 5).map((item) => ({ id: item.id, role: item.role, type: item.type, score: `${item.score}/100` }));

  // Fix: compute each user's actual top score
  const usersWithScores = users.map((u) => {
    const userInterviews = interviews.filter((i) => i.userId === u.id);
    const topScore = userInterviews.length ? Math.max(...userInterviews.map((i) => i.score)) : 0;
    return {
      name: u.name,
      email: u.email,
      avatar: u.avatarUrl || `https://i.pravatar.cc/150?u=${u.id}`,
      topScore,
      domain: userInterviews[0]?.role || 'Not specified',
    };
  });

  res.json({
    stats: { totalInterviews: total, avgScore: `${avg}/100`, lastScore: `${last}/100`, activeUsers: users.length },
    recent,
    performance,
    users: usersWithScores,
  });
});

app.get('/api/interviews/latest-report', (_req: Request, res: Response) => {
  if (!interviews.length) return res.status(404).json({ message: 'No reports available' });
  return res.json(interviews[0]);
});

app.get('/api/interviews/:id', (req: Request, res: Response) => {
  const report = interviews.find((i) => i.id === req.params.id);
  if (!report) return res.status(404).json({ message: 'Report not found' });
  return res.json(report);
});

// Templates
app.get('/api/templates', (_req, res) => res.json(templates));

// WebRTC signaling stubs
app.post('/api/webrtc/offer', (_req: Request, res: Response) => {
  return res.status(200).json({
    answer: null,
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    message: 'AI WebRTC backend not configured yet (demo mode).',
  });
});

app.post('/api/webrtc/ice-candidate', (_req: Request, res: Response) => {
  return res.status(200).json({ received: true, message: 'Candidate received (demo mode).' });
});

// Global error handler
app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(_err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Resume2Role API running at http://localhost:${port}`);
});
