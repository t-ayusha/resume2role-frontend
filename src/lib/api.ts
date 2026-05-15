const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export type User = {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export type InterviewReport = {
  id: string
  role: string
  type: string
  score: number
  createdAt: string
  verdict: string
  overallImpression: string
  breakdown: Array<{
    title: string
    score: string
    bullets: string[]
  }>
}

type SummaryResponse = {
  stats: {
    totalInterviews: number
    avgScore: string
    lastScore: string
    activeUsers: number
  }
  recent: Array<{ id: string; role: string; type: string; score: string }>
  performance: number[]
  users?: Array<{
    name: string
    email: string
    avatar: string
    topScore: number
    domain: string
  }>
}

export interface InterviewTemplate {
  _id: string;
  title: string;
  description: string;
  role: string;
  type: string;
  icon?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || 'Request failed')
  }
  return response.json() as Promise<T>
}

export async function loginApi(email: string, password: string) {
  return request<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function signupApi(name: string, email: string, password: string) {
  return request<{ token: string; user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function googleLoginApi(payload?: { name?: string; email?: string }) {
  return request<{ token: string; user: User }>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ provider: 'google', ...payload }),
  })
}

export async function completeInterviewApi(payload: { role?: string; type?: string }) {
  return request<InterviewReport>('/interviews/complete', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getSummaryApi() {
  return request<SummaryResponse>('/interviews/summary')
}

export async function getLatestReportApi() {
  return request<InterviewReport>('/interviews/latest-report')
}

export async function getReportByIdApi(id: string) {
  return request<InterviewReport>(`/interviews/${id}`)
}

export async function getTemplatesApi() {
  return request<InterviewTemplate[]>('/templates')
}
