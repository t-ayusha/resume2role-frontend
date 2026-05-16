export const INTERVIEW_SESSION_KEY =
  'prepwise-interview-session'

export type StoredInterviewSession =
  {
    interviewId?: string

    resumeId?: string

    role?: string

    type?: string

    questions?: string[]

    currentQuestion?: string

    questionIndex?: number

    resumeName?: string
  }

export function saveInterviewSession(
  session: StoredInterviewSession
) {
  window.localStorage.setItem(
    INTERVIEW_SESSION_KEY,
    JSON.stringify(session)
  )
}

export function getInterviewSession(): StoredInterviewSession | null {
  try {
    const raw =
      window.localStorage.getItem(
        INTERVIEW_SESSION_KEY
      )

    if (!raw) return null

    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearInterviewSession() {
  window.localStorage.removeItem(
    INTERVIEW_SESSION_KEY
  )
}