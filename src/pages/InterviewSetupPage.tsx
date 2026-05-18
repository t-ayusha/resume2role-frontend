import type { FormEvent } from 'react'
import {
  saveInterviewSession,
} from '../lib/interviewSession'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import AppFooter from '../components/AppFooter'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'

import { useAuth } from '../context/AuthContext'

import {
  startInterviewApi,
  uploadResumeApi,
} from '../lib/api'

import { DashboardLayout } from '../layout/DashboardLayout'

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Product Manager',
]

function InterviewSetupPage() {
  const navigate = useNavigate()

  const location = useLocation()

  const { isAdmin, user } =
    useAuth()

  const [role, setRole] =
    useState(
      'Frontend Developer'
    )

  const [type, setType] =
    useState('Technical')

  const [difficulty, setDifficulty] =
    useState('Beginner')

  const [isRoleOpen, setIsRoleOpen] =
    useState(false)

  const [resume, setResume] =
    useState<File | null>(null)

  const [uploading, setUploading] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const roleRef =
    useRef<HTMLDivElement>(null)

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdmin) {
      navigate('/dashboard')
      return
    }

    if (location.state) {
      if (location.state.role) {
        setRole(location.state.role)
      }

      if (location.state.type) {
        setType(location.state.type)
      }

      if (
        location.state.difficulty
      ) {
        setDifficulty(
          location.state.difficulty
        )
      }
    }

    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        roleRef.current &&
        !roleRef.current.contains(
          event.target as Node
        )
      ) {
        setIsRoleOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
  }, [
    location.state,
    isAdmin,
    navigate,
  ])

  const onSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    navigate('/interview/live', {
      state: {
        role,
        type,
        difficulty,
        hasResume: false,
      },
    })
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target.files &&
      e.target.files[0]
    ) {
      const file =
        e.target.files[0]

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        setMessage(
          'Resume must be under 10MB.'
        )

        return
      }

      setMessage('')
      setResume(file)
    }
  }

  const onResumeSubmit =
  async () => {
    if (!resume || !user?.email) {
      setMessage(
        'Please upload a resume first.'
      )

      return
    }

    try {
      setUploading(true)

      setMessage(
        'Uploading and analyzing resume...'
      )

      const uploadedResume =
        await uploadResumeApi(
          user.email,
          resume
        )

      setMessage(
        'Generating interview questions...'
      )

      const interview =
        await startInterviewApi(
          uploadedResume.id
        )

      const session = {
        interviewId:
          interview.id,

        resumeId:
          uploadedResume.id,

        role:
          uploadedResume
            .technicalProfile
            ?.predictedRole ||
          role,

        type: 'Technical',

        questions:
          interview.questions,

        currentQuestion:
          interview.questions?.[0],

        questionIndex: 0,

        resumeName:
          resume.name,
      }

      saveInterviewSession(
        session
      )

      navigate(
        '/interview/live',
        {
          state: session,
        }
      )
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Resume upload failed'
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <DashboardLayout>
      <section className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">
            Interview Setup
          </h1>

          <p className="text-sm text-gray-400">
            Choose how you want
            to be interviewed
            today.
          </p>
        </div>

        {message ? (
          <div className="rounded-2xl border border-[#C7B8FF]/20 bg-[#C7B8FF]/10 p-4 text-sm text-[#E6DEFF]">
            {message}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Standard Interview */}

          <GlassCard className="flex h-full flex-col space-y-6 p-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#C7B8FF]">
                Standard MOC
                Interview
              </h2>

              <p className="text-sm text-gray-400">
                Practice with
                industry-standard
                questions.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="flex flex-1 flex-col space-y-6"
            >
              <div className="space-y-6">
                <div
                  className="space-y-2"
                  ref={roleRef}
                >
                  <span className="text-sm text-gray-300">
                    Target Role
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsRoleOpen(
                          !isRoleOpen
                        )
                      }
                      className="flex w-full items-center justify-between rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white outline-none transition-all hover:bg-white/10 focus:border-[#C7B8FF] focus:ring-2 focus:ring-[#C7B8FF]/35"
                    >
                      <span>{role}</span>

                      <motion.span
                        animate={{
                          rotate:
                            isRoleOpen
                              ? 180
                              : 0,
                        }}
                        className="text-gray-400"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isRoleOpen && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 10,
                            scale: 0.95,
                          }}
                          animate={{
                            opacity: 1,
                            y: 5,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: 10,
                            scale: 0.95,
                          }}
                          className="absolute z-50 w-full overflow-hidden rounded-3xl border border-white/15 bg-[#1A1F2E]/95 backdrop-blur-xl shadow-2xl"
                        >
                          <div className="py-2">
                            {ROLES.map(
                              (r) => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => {
                                    setRole(
                                      r
                                    )

                                    setIsRoleOpen(
                                      false
                                    )
                                  }}
                                  className={`flex w-full items-center px-6 py-3 text-sm transition-colors hover:bg-[#C7B8FF]/10 ${
                                    role ===
                                    r
                                      ? 'bg-[#C7B8FF]/5 text-[#C7B8FF]'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  {r}

                                  {role ===
                                    r && (
                                    <motion.span
                                      layoutId="active-role"
                                      className="ml-auto text-[#C7B8FF]"
                                    >
                                      ✓
                                    </motion.span>
                                  )}
                                </button>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm text-gray-300">
                    Interview type
                  </span>

                  <div className="relative flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                    {[
                      'Technical',
                      'Behavioral',
                    ].map((card) => (
                      <button
                        key={card}
                        type="button"
                        onClick={() =>
                          setType(card)
                        }
                        className="relative z-10 flex-1 rounded-full py-2 text-sm font-medium transition-colors duration-200"
                      >
                        <span
                          className={
                            type ===
                            card
                              ? 'text-[#0B1020]'
                              : 'text-gray-400'
                          }
                        >
                          {card}
                        </span>

                        {type ===
                          card && (
                          <motion.div
                            layoutId="active-type"
                            className="absolute inset-0 -z-10 rounded-full bg-[#C7B8FF] shadow-[0_0_20px_rgba(199,184,255,0.4)]"
                            transition={{
                              type: 'spring',
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm text-gray-300">
                    Difficulty
                  </span>

                  <div className="relative flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                    {[
                      'Beginner',
                      'Intermediate',
                      'Advanced',
                    ].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setDifficulty(
                            level
                          )
                        }
                        className="relative z-10 flex-1 rounded-full py-2 text-sm font-medium transition-colors duration-200"
                      >
                        <span
                          className={
                            difficulty ===
                            level
                              ? 'text-[#0B1020]'
                              : 'text-gray-400'
                          }
                        >
                          {level}
                        </span>

                        {difficulty ===
                          level && (
                          <motion.div
                            layoutId="active-difficulty"
                            className="absolute inset-0 -z-10 rounded-full bg-[#C7B8FF] shadow-[0_0_20px_rgba(199,184,255,0.4)]"
                            transition={{
                              type: 'spring',
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <PrimaryButton
                  type="submit"
                  className="w-full"
                >
                  Start Standard
                  Interview
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>

          {/* Resume Interview */}

          <GlassCard className="flex h-full flex-col space-y-6 p-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#C7B8FF]">
                Resume Based
                Interview
              </h2>

              <p className="text-sm text-gray-400">
                Get interviewed
                based on your own
                experience.
              </p>
            </div>

            <div className="flex flex-1 flex-col space-y-6">
              <div className="space-y-3">
                <span className="text-sm text-gray-300">
                  Upload your
                  Resume
                </span>

                <div
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-all duration-300 ${
                    resume
                      ? 'border-[#C7B8FF] bg-[#C7B8FF]/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={
                      handleFileChange
                    }
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />

                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div
                      className={`rounded-2xl p-4 ${
                        resume
                          ? 'bg-[#C7B8FF] text-[#0B1020]'
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {resume ? (
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      )}
                    </div>

                    <div>
                      <p
                        className={`text-base font-medium ${
                          resume
                            ? 'text-white'
                            : 'text-gray-300'
                        }`}
                      >
                        {resume
                          ? resume.name
                          : 'Click to upload your resume'}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        PDF, DOC,
                        or DOCX up
                        to 10MB
                      </p>
                    </div>
                  </div>

                  {resume && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()

                        setResume(
                          null
                        )
                      }}
                      className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-gray-400 transition-all hover:bg-white/20 hover:text-white"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="rounded-2xl border border-[#C7B8FF]/10 bg-[#C7B8FF]/5 p-4">
                  <p className="text-sm leading-relaxed text-gray-400">
                    <span className="font-medium text-[#C7B8FF]">
                      How it
                      works:
                    </span>{' '}
                    Our AI will
                    analyze your
                    resume to
                    generate
                    personalized
                    technical and
                    behavioral
                    questions
                    specifically
                    tailored to
                    your
                    experience.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <PrimaryButton
                  onClick={
                    onResumeSubmit
                  }
                  disabled={
                    !resume ||
                    uploading
                  }
                  className={`w-full ${
                    !resume ||
                    uploading
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }`}
                >
                  {uploading
                    ? 'Processing Resume...'
                    : 'Start Resume Interview'}
                </PrimaryButton>
              </div>
            </div>
          </GlassCard>
        </div>

        <AppFooter />
      </section>
    </DashboardLayout>
  )
}

export default InterviewSetupPage