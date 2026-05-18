const API_URL =
  import.meta.env
    .VITE_API_URL ??
  'http://localhost:8080/api'

export const TOKEN_KEY =
  'Resume2Role-token'

/* =========================
   TYPES
========================= */

export type User = {
  id?: string
  name: string
  email: string
  avatarUrl?: string
}

export type ResumeUploadResponse =
  {
    id: string
    userId: string
    fileName: string
    fileUrl: string
    extractedText: string

    technicalProfile?: {
      predictedRole?: string
      experienceLevel?: string
      score?: number
      skills?: unknown
    }
  }

export type InterviewStartResponse =
  {
    id: string

    userId?: string

    resumeId?: string

    questions: string[]

    currentQuestionIndex: number

    status: string

    startedAt?: string
  }

export type InterviewResult = {
  interviewId: string

  averageScore: number

  totalQuestions: number

  strengths: string[]

  weaknesses: string[]

  overallFeedback: string
}

export type InterviewSummary =
  {
    id: string

    role?: string

    type?: string

    score?: number

    status?: string

    createdAt?: string
  }

/* =========================
   CORE REQUEST HELPER
========================= */

async function request<T>(
  path: string,
  init?: RequestInit,
  isFormData = false
): Promise<T> {
  const token =
    window.localStorage.getItem(
      TOKEN_KEY
    )

  const headers: HeadersInit = {
    ...(isFormData
      ? {}
      : {
          'Content-Type':
            'application/json',
        }),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

    ...(init?.headers ?? {}),
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...init,
      headers,
    }
  )

  if (!response.ok) {
    let message =
      'Request failed'

    try {
      const errorBody =
        await response.json()

      message =
        errorBody.message ||
        message
    } catch {
      // ignore
    }

    throw new Error(message)
  }

  const contentType =
    response.headers.get(
      'content-type'
    )

  if (
    contentType?.includes(
      'application/json'
    )
  ) {
    return response.json() as Promise<T>
  }

  return response.text() as T
}

/* =========================
   AUTH APIs
========================= */

export async function loginApi(
  email: string,
  password: string
) {
  const token =
    await request<string>(
      '/auth/login',
      {
        method: 'POST',

        body: JSON.stringify({
          email,
          password,
        }),
      }
    )

  return {
    token,

    user: {
      name:
        email.split('@')[0],

      email,
    } as User,
  }
}

export async function signupApi(
  name: string,
  email: string,
  password: string
) {
  const token =
    await request<string>(
      '/auth/register',
      {
        method: 'POST',

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    )

  return {
    token,

    user: {
      name,
      email,
    } as User,
  }
}

/* =========================
   RESUME APIs
========================= */

export async function uploadResumeApi(
  userId: string,
  file: File
) {
  const formData =
    new FormData()

  formData.append(
    'userId',
    userId
  )

  formData.append(
    'file',
    file
  )

  return request<ResumeUploadResponse>(
    '/resumes/upload',
    {
      method: 'POST',

      body: formData,
    },
    true
  )
}

export async function getResumeApi(
  resumeId: string
) {
  return request(
    `/resumes/${resumeId}`
  )
}

export async function deleteResumeApi(
  resumeId: string
) {
  return request(
    `/resumes/${resumeId}`,
    {
      method: 'DELETE',
    }
  )
}

/* =========================
   INTERVIEW APIs
========================= */

export async function startInterviewApi(
  resumeId: string
) {
  return request<InterviewStartResponse>(
    `/interview/start/${resumeId}`,
    {
      method: 'POST',
    }
  )
}

export async function getNextQuestionApi(
  interviewId: string
) {
  return request<string>(
    `/interview/${interviewId}/next`
  )
}

export async function submitAnswerApi(
  interviewId: string,

  payload: {
    answer: string
    transcript: string
    duration: number
  }
) {
  return request(
    `/interview/${interviewId}/answer`,
    {
      method: 'POST',

      body: JSON.stringify(
        payload
      ),
    }
  )
}

export async function getInterviewApi(
  interviewId: string
) {
  return request(
    `/interview/${interviewId}`
  )
}

export async function getInterviewResultApi(
  interviewId: string
) {
  return request<InterviewResult>(
    `/interview/${interviewId}/result`
  )
}

export async function getUserInterviewsApi(
  userId: string
) {
  return request<
    InterviewSummary[]
  >(
    `/interview/user/${userId}`
  )
}

/* =========================
   TEMPLATE APIs
========================= */

export type InterviewTemplate =
  {
    id: string
    title: string
    description: string
    role: string
    type: string
    icon?: string
  }

export async function getTemplatesApi() {
  return []
}