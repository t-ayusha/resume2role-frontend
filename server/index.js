import express from 'express'
import cors from 'cors'

const app = express()
const port = 4000

app.use(cors())
app.use(express.json())

const users = [
  {
    id: 'u1',
    name: 'Ankit',
    email: 'ankitadash4656@gmail.com',
    password: '22bcsj43',
    avatarUrl: '/src/assets/profile_img/f1.jpg',
  },
]
const interviews = [
  {
    id: 'r1',
    role: 'Frontend Developer',
    type: 'Technical',
    score: 12,
    createdAt: new Date().toISOString(),
    verdict: 'Not Recommended',
    overallImpression:
      'Your responses showed intent but lacked structured examples and strong role-specific impact.',
    breakdown: [
      {
        title: 'Communication Skills',
        score: '5/20',
        bullets: ['Responses lacked structure.', 'Examples were limited.'],
      },
      {
        title: 'Technical Depth',
        score: '4/20',
        bullets: ['Concepts were partially correct.', 'More practical examples needed.'],
      },
    ],
  },
]

const performance = [30, 45, 20, 58, 35, 48, 62]

function createToken(user) {
  return `prepwise-token-${user.id}`
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'PrepWise API', timestamp: new Date().toISOString() })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = users.find((item) => item.email === email && item.password === password)
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  return res.json({
    token: createToken(user),
    user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  })
})

app.post('/api/auth/signup', (req, res) => {
  const { email, password, name } = req.body
  const exists = users.some((item) => item.email === email)
  if (exists) {
    return res.status(409).json({ message: 'Email already exists' })
  }
  const user = { id: `u${users.length + 1}`, name: name || 'PrepWise User', email, password }
  users.push(user)
  return res.status(201).json({
    token: createToken(user),
    user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  })
})

app.post('/api/auth/google', (req, res) => {
  const googleEmail = req.body?.email || 'google.user@prepwise.dev'
  const googleName = req.body?.name || 'Google User'
  let user = users.find((item) => item.email === googleEmail)

  if (!user) {
    user = {
      id: `u${users.length + 1}`,
      name: googleName,
      email: googleEmail,
      password: 'google-oauth',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    }
    users.push(user)
  }

  return res.json({
    token: createToken(user),
    user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  })
})

app.post('/api/interviews/complete', (req, res) => {
  const { role = 'Frontend Developer', type = 'Technical' } = req.body
  const score = Math.max(5, Math.floor(Math.random() * 70))
  const report = {
    id: `r${interviews.length + 1}`,
    role,
    type,
    score,
    createdAt: new Date().toISOString(),
    verdict: score >= 60 ? 'Recommended' : 'Not Recommended',
    overallImpression:
      score >= 60
        ? 'Strong answers and good communication. Continue refining with quantified examples.'
        : 'Responses need stronger structure, confidence, and technical specificity.',
    breakdown: [
      {
        title: 'Communication',
        score: `${Math.min(20, Math.floor(score / 3))}/20`,
        bullets: ['Use STAR format.', 'Keep answers focused and concise.'],
      },
      {
        title: 'Technical',
        score: `${Math.min(20, Math.floor(score / 3))}/20`,
        bullets: ['Add more real project depth.', 'Explain trade-offs clearly.'],
      },
    ],
  }
  interviews.unshift(report)
  performance.push(score)
  if (performance.length > 10) performance.shift()
  return res.status(201).json(report)
})

app.get('/api/interviews/summary', (_req, res) => {
  const total = interviews.length
  const avg = total ? Math.round(interviews.reduce((sum, i) => sum + i.score, 0) / total) : 0
  const last = total ? interviews[0].score : 0
  const recent = interviews.slice(0, 5).map((item) => ({
    id: item.id,
    role: item.role,
    type: item.type,
    score: `${item.score}/100`,
  }))

  res.json({
    stats: {
      totalInterviews: total,
      avgScore: `${avg}/100`,
      lastScore: `${last}/100`,
    },
    recent,
    performance,
  })
})

app.get('/api/interviews/latest-report', (_req, res) => {
  if (!interviews.length) return res.status(404).json({ message: 'No reports available' })
  return res.json(interviews[0])
})

app.get('/api/interviews/:id', (req, res) => {
  const report = interviews.find((item) => item.id === req.params.id)
  if (!report) return res.status(404).json({ message: 'Report not found' })
  return res.json(report)
})

app.listen(port, () => {
  console.log(`PrepWise local API running at http://localhost:${port}`)
})
