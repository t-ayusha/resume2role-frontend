import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import TranscriptBar from '../components/TranscriptBar'

import {
  getInterviewResultApi,
  getNextQuestionApi,
  submitAnswerApi,
} from '../lib/api'

import {
  clearInterviewSession,
  getInterviewSession,
  saveInterviewSession,
} from '../lib/interviewSession'

import { speakText } from '../lib/textToSpeech'

import { useSpeechRecognition } from '../lib/useSpeechRecognition'

import { useAuth } from '../context/AuthContext'

import PageWrapper from '../layout/PageWrapper'

function cleanQuestion(text: string) {
  if (!text) return ''

  return text
    .replace(/\\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\d+\.\s*/g, '')
    .replace(/nHow/g, ' How')
    .replace(/nCan/g, ' Can')
    .replace(/nWhy/g, ' Why')
    .replace(/nWhat/g, ' What')
    .replace(/nExplain/g, ' Explain')
    .replace(/nTell/g, ' Tell')
    .trim()
}

function InterviewLivePage() {
  const navigate = useNavigate()

  const location = useLocation()

  const { user } = useAuth()

  const navigationState =
    (location.state as {
      interviewId?: string
      resumeName?: string
      role?: string
      type?: string
      currentQuestion?: string
    }) || {}

  const storedSession =
    getInterviewSession()

  const interviewId =
    navigationState.interviewId ||
    storedSession?.interviewId

  const resumeName =
    navigationState.resumeName ||
    storedSession?.resumeName

  const role =
    navigationState.role ||
    storedSession?.role

  const type =
    navigationState.type ||
    storedSession?.type

  const initialQuestion =
    navigationState.currentQuestion ||
    storedSession?.currentQuestion ||
    ''

  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    )

  const streamRef =
    useRef<MediaStream | null>(
      null
    )

  const transcriptRef =
    useRef<string>('')

  const [questionIndex, setQuestionIndex] =
    useState(1)

  const [currentQuestion, setCurrentQuestion] =
    useState(
      cleanQuestion(initialQuestion)
    )

  const [seconds, setSeconds] =
    useState(0)

  const [micOn, setMicOn] =
    useState(true)

  const [cameraOn, setCameraOn] =
    useState(true)

  const [mediaError, setMediaError] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const [transcript, setTranscript] =
    useState('')

  const [loadingNext, setLoadingNext] =
    useState(false)

  useEffect(() => {
    if (!interviewId) return

    saveInterviewSession({
      interviewId,
      role,
      type,
      currentQuestion,
      resumeName,
    })
  }, [
    interviewId,
    role,
    type,
    currentQuestion,
    resumeName,
  ])

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setSeconds(
          (prev) => prev + 1
        )
      }, 1000)

    return () =>
      window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!currentQuestion) return

    transcriptRef.current = ''
    setTranscript('')

    window.speechSynthesis.cancel()

    void speakText(
      cleanQuestion(currentQuestion)
    )
  }, [currentQuestion])

  useEffect(() => {
    const setupMedia = async () => {
      try {
        setMediaError('')

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
            },
            audio: true,
          })

        streamRef.current = stream

        const video =
          videoRef.current

        if (video) {
          video.srcObject = stream

          video.muted = true

          video.onloadedmetadata =
            async () => {
              try {
                await video.play()
              } catch (err) {
                console.error(
                  'Video play error:',
                  err
                )
              }
            }
        }
      } catch (error) {
        console.error(error)

        if (
          error instanceof DOMException
        ) {
          if (
            error.name ===
            'NotAllowedError'
          ) {
            setMediaError(
              'Camera/microphone permission denied.'
            )
          } else if (
            error.name ===
            'NotFoundError'
          ) {
            setMediaError(
              'Camera device not found.'
            )
          } else {
            setMediaError(
              error.message
            )
          }
        } else {
          setMediaError(
            'Failed to access camera.'
          )
        }
      }
    }

    void setupMedia()

    return () => {
      window.speechSynthesis.cancel()

      streamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        )
    }
  }, [])

  useEffect(() => {
    streamRef.current
      ?.getAudioTracks()
      .forEach((track) => {
        track.enabled = micOn
      })
  }, [micOn])

  useEffect(() => {
    streamRef.current
      ?.getVideoTracks()
      .forEach((track) => {
        track.enabled =
          cameraOn
      })
  }, [cameraOn])

  const formattedTime =
    useMemo(() => {
      const min = String(
        Math.floor(seconds / 60)
      ).padStart(2, '0')

      const sec = String(
        seconds % 60
      ).padStart(2, '0')

      return `${min}:${sec}`
    }, [seconds])

  const handleTranscript =
    useCallback(
      ({
        finalText,
        interimText,
      }: {
        finalText: string
        interimText: string
      }) => {
        const combined =
          `${finalText} ${interimText}`.trim()

        transcriptRef.current =
          combined

        setTranscript(combined)
      },
      []
    )

  useSpeechRecognition({
    lang: 'en-US',
    interim: true,
    continuous: true,
    enabled:
      micOn &&
      !submitting,
    onTranscript:
      handleTranscript,
  })

  const handleNextQuestion =
    async () => {
      if (
        !interviewId ||
        loadingNext
      ) {
        return
      }

      try {
        setLoadingNext(true)

        window.speechSynthesis.cancel()

        await submitAnswerApi(
          interviewId,
          {
            answer:
              transcriptRef.current.trim(),
            transcript:
              transcriptRef.current.trim(),
            duration:
              seconds,
          }
        )

        const nextQuestion =
          await getNextQuestionApi(
            interviewId
          )

        const cleanedQuestion =
          cleanQuestion(
            nextQuestion
          )

        if (
          cleanedQuestion
            .toLowerCase()
            .includes(
              'interview completed'
            )
        ) {
          await onEndInterview()

          return
        }

        setQuestionIndex(
          (prev) => prev + 1
        )

        setCurrentQuestion(
          cleanedQuestion
        )

        transcriptRef.current = ''
        setTranscript('')
        setSeconds(0)

        saveInterviewSession({
          interviewId,
          role,
          type,
          currentQuestion:
            cleanedQuestion,
          resumeName,
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingNext(false)
      }
    }

  const onEndInterview =
    async () => {
      if (
        submitting ||
        !interviewId
      ) {
        return
      }

      setSubmitting(true)

      try {
        window.speechSynthesis.cancel()

        streamRef.current
          ?.getTracks()
          .forEach((track) =>
            track.stop()
          )

        const result =
          await getInterviewResultApi(
            interviewId
          )

        clearInterviewSession()

        navigate(
          `/interview/report?id=${interviewId}`,
          {
            state: {
              result,
            },
          }
        )
      } catch (error) {
        console.error(error)

        navigate(
          '/interview/report'
        )
      } finally {
        setSubmitting(false)
      }
    }

  const userAvatarUrl =
    user?.avatarUrl ||
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'

  return (
    <PageWrapper
      className="items-start"
      innerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8"
    >
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold tracking-wide text-[#C7B8FF]">
            Resume2Role
          </p>

          <div className="flex items-center gap-3">
            {resumeName && (
              <span className="hidden rounded-full border border-[#C7B8FF]/20 bg-[#C7B8FF]/10 px-3 py-1 text-xs text-[#C7B8FF] md:block">
                AI analyzing: {resumeName}
              </span>
            )}

            <img
              src={userAvatarUrl}
              alt="User avatar"
              className="h-10 w-10 rounded-full border border-white/20 object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-[320px] w-full object-cover bg-black"
            />

            <div className="border-t border-white/10 bg-white/5 p-4 text-center font-semibold">
              You
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <TranscriptBar
              question={
                currentQuestion
              }
            />
          </div>
        </div>

        <GlassCard className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                Your Answer
              </p>

              <p className="min-h-[3rem] text-base text-white md:text-lg">
                {transcript ||
                  'Listening…'}
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                Session Info
              </p>

              <div className="space-y-1 text-sm text-gray-300">
                <p>
                  Question:{' '}
                  {questionIndex}
                </p>

                <p>
                  Elapsed:{' '}
                  {formattedTime}
                </p>

                <p
                  className={
                    micOn
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {micOn
                    ? '🎙 Mic on'
                    : '🔇 Mic off'}
                </p>

                <p
                  className={
                    cameraOn
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {cameraOn
                    ? '📷 Camera on'
                    : '📷 Camera off'}
                </p>
              </div>
            </div>
          </div>

          {mediaError && (
            <p className="text-sm text-red-400">
              {mediaError}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              variant="secondary"
              className="w-auto"
              type="button"
              onClick={
                handleNextQuestion
              }
              disabled={
                loadingNext
              }
            >
              {loadingNext
                ? 'Loading...'
                : 'Next Question'}
            </PrimaryButton>

            <PrimaryButton
              variant="danger"
              className="w-auto"
              type="button"
              onClick={
                onEndInterview
              }
              disabled={
                submitting
              }
            >
              {submitting
                ? 'Ending…'
                : 'Finish Interview'}
            </PrimaryButton>
          </div>
        </GlassCard>
      </div>
    </PageWrapper>
  )
}

export default InterviewLivePage