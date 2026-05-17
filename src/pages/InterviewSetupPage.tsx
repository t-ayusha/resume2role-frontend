import type { FormEvent } from 'react'

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

import {
  clearInterviewSession,
  saveInterviewSession,
} from '../lib/interviewSession'

import { DashboardLayout } from '../layout/DashboardLayout'

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Product Manager',
]

function InterviewSetupPage() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const {
    isAdmin,
    user,
  } = useAuth()

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
    useState<File | null>(
      null
    )

  const [uploading, setUploading] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const roleRef =
    useRef<HTMLDivElement>(
      null
    )

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    )

  useEffect(() => {
    clearInterviewSession()

    if (isAdmin) {
      navigate('/dashboard')

      return
    }

    if (location.state) {
      if (
        location.state.role
      ) {
        setRole(
          location.state.role
        )
      }

      if (
        location.state.type
      ) {
        setType(
          location.state.type
        )
      }

      if (
        location.state
          .difficulty
      ) {
        setDifficulty(
          location.state
            .difficulty
        )
      }
    }

    const handleClickOutside =
      (
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

    setMessage(
      'Standard interview integration pending. Please use resume-based interview.'
    )
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
      if (
        !resume ||
        !user?.email
      ) {
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

        const questions =
          interview.questions?.filter(
            (q: string) =>
              q?.trim()?.length > 0
          ) || []

        const session = {
          interviewId:
            interview.id,

          resumeId:
            uploadedResume.id,

          role:
            (
              uploadedResume.technicalProfile as {
                predictedRole?: string
              }
            )?.predictedRole ||
            role,

          type: 'Technical',

          questions,

          questionIndex: 0,

          currentQuestion:
            questions[0] ||
            'Tell me about yourself.',

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
          <GlassCard className="flex h-full flex-col space-y-6 p-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#C7B8FF]">
                Standard Mock
                Interview
              </h2>

              <p className="text-sm text-gray-400">
                Generic interview
                mode integration
                pending.
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
                      className="flex w-full items-center justify-between rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white outline-none transition-all hover:bg-white/10"
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
                        ▼
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
                          className="absolute z-50 w-full overflow-hidden rounded-3xl border border-white/15 bg-[#1A1F2E]/95 backdrop-blur-xl"
                        >
                          <div className="py-2">
                            {ROLES.map(
                              (
                                r
                              ) => (
                                <button
                                  key={
                                    r
                                  }
                                  type="button"
                                  onClick={() => {
                                    setRole(
                                      r
                                    )

                                    setIsRoleOpen(
                                      false
                                    )
                                  }}
                                  className={`flex w-full items-center px-6 py-3 text-sm hover:bg-[#C7B8FF]/10 ${
                                    role ===
                                    r
                                      ? 'bg-[#C7B8FF]/5 text-[#C7B8FF]'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  {r}
                                </button>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <PrimaryButton
                  type="submit"
                  className="w-full"
                >
                  Standard Interview
                  Coming Soon
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>

          <GlassCard className="flex h-full flex-col space-y-6 p-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#C7B8FF]">
                Resume Based
                Interview
              </h2>

              <p className="text-sm text-gray-400">
                Get interviewed
                based on your
                real experience.
              </p>
            </div>

            <div className="flex flex-1 flex-col space-y-6">
              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 ${
                  resume
                    ? 'border-[#C7B8FF] bg-[#C7B8FF]/5'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
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

                <div className="text-center">
                  <p className="text-lg font-medium text-white">
                    {resume
                      ? resume.name
                      : 'Upload Resume'}
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    PDF, DOC,
                    DOCX
                  </p>
                </div>
              </div>

              <PrimaryButton
                onClick={
                  onResumeSubmit
                }
                disabled={
                  !resume ||
                  uploading
                }
                className="w-full"
              >
                {uploading
                  ? 'Processing Resume...'
                  : 'Start Resume Interview'}
              </PrimaryButton>
            </div>
          </GlassCard>
        </div>

        <AppFooter />
      </section>
    </DashboardLayout>
  )
}

export default InterviewSetupPage