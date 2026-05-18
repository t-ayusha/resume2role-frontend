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
      questions?: string[]
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

  const questions =
    navigationState.questions ||
    storedSession?.questions ||
    []

  const initialQuestionIndex =
    storedSession?.questionIndex || 0

  const initialQuestion =
    storedSession?.currentQuestion ||
    questions[0] ||
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
    useRef('')

  const isAiSpeakingRef =
    useRef(false)

  const recognitionResetKeyRef =
    useRef(0)

  const [questionIndex, setQuestionIndex] =
    useState(
      initialQuestionIndex
    )

  const [currentQuestion, setCurrentQuestion] =
    useState(
      initialQuestion
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
    if (!interviewId)
      return

    saveInterviewSession({
      interviewId,
      role,
      type,
      questions,
      currentQuestion,
      questionIndex,
      resumeName,
    })
  }, [
    interviewId,
    role,
    type,
    questions,
    currentQuestion,
    questionIndex,
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
    if (!currentQuestion)
      return

    transcriptRef.current = ''

    setTranscript('')

    recognitionResetKeyRef.current += 1

    const speakQuestion =
      async () => {
        isAiSpeakingRef.current =
          true

        try {
          await speakText(
            currentQuestion
          )
        } finally {
          setTimeout(() => {
            isAiSpeakingRef.current =
              false
          }, 1200)
        }
      }

    void speakQuestion()
  }, [currentQuestion])

  useEffect(() => {

    const setupMedia = async () => {

      try {

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              width: 1280,
              height: 720,
              facingMode: 'user',
            },
            audio: true,
          })

        streamRef.current = stream

        const videoTrack =
          stream.getVideoTracks()[0]

        if (videoTrack) {
          videoTrack.enabled = true
        }

        if (videoRef.current) {

          videoRef.current.srcObject =
            stream

          videoRef.current.muted = true

          videoRef.current.playsInline = true

          videoRef.current.onloadedmetadata =
            () => {

              videoRef.current
                ?.play()
                .catch((err) => {
                  console.error(
                    'Video play failed:',
                    err
                  )
                })
            }
        }

        setCameraOn(true)

        setMediaError('')

      } catch (err) {

        console.error(
          'Media setup failed:',
          err
        )

        setMediaError(
          'Unable to access camera/microphone.'
        )
      }
    }

    void setupMedia()

    return () => {

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

  const formattedTime =
    useMemo(() => {
      const min = String(
        Math.floor(
          seconds / 60
        )
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

        if (
          isAiSpeakingRef.current
        ) {
          return
        }

        const cleanTranscript =
          `${finalText} ${interimText}`.trim()

        transcriptRef.current =
          cleanTranscript

        setTranscript(
          cleanTranscript
        )
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
    resetKey:
      recognitionResetKeyRef.current,
    onTranscript:
      handleTranscript,
  })

  const nextQuestion =
    async () => {

      if (!interviewId)
        return

      try {

        setLoadingNext(true)

        await submitAnswerApi(
          interviewId,
          {
            answer:
              transcriptRef.current,

            transcript:
              transcriptRef.current,

            duration:
              seconds,
          }
        )

        transcriptRef.current = ''

        setTranscript('')

        const next =
          await getNextQuestionApi(
            interviewId
          )

        if (
          !next ||
          next
            .toLowerCase()
            .includes(
              'interview completed'
            )
        ) {

          await onEndInterview()

          return
        }

        const nextIndex =
          questionIndex + 1

        setQuestionIndex(
          nextIndex
        )

        setCurrentQuestion(
          next
        )

        saveInterviewSession({
          interviewId,
          role,
          type,
          questions,
          currentQuestion:
            next,
          questionIndex:
            nextIndex,
          resumeName,
        })

      } finally {

        setLoadingNext(false)
      }
    }

  const onEndInterview =
    async () => {

      if (
        submitting ||
        !interviewId
      )
        return

      setSubmitting(true)

      try {

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

      } catch {

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

        <div className="flex flex-wrap items-center justify-between gap-3">

          <h1 className="text-2xl font-semibold md:text-3xl">
            {role || 'AI Interview'}
          </h1>

          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-gray-100">
            {type || 'Technical'}
          </span>
        </div>

        <GlassCard className="space-y-5">

          <div className="flex justify-center">

            <div className="flex w-full max-w-md flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/5 p-6 text-center">

              <div className="mb-4 h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-black">

                {mediaError || !cameraOn ? (

                  <div className="flex h-full items-center justify-center text-sm text-gray-300">
                    {mediaError || 'Camera is off'}
                  </div>

                ) : (

                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <p className="text-lg font-semibold">
                {user?.name || 'You'}
              </p>
            </div>
          </div>

          <TranscriptBar
            question={
              currentQuestion
            }
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5">

              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                Your Answer
              </p>

              <p className="min-h-[3rem] text-base text-white md:text-lg">
                {transcript || 'Listening…'}
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5">

              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                Session Info
              </p>

              <div className="space-y-1 text-sm text-gray-300">

                <p>
                  Question {questionIndex + 1}
                </p>

                <p>
                  Elapsed: {formattedTime}
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
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">

            <PrimaryButton
              variant="secondary"
              className="w-auto"
              type="button"
              onClick={
                nextQuestion
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
                : 'Leave Interview'}
            </PrimaryButton>
          </div>
        </GlassCard>

        <GlassCard className="mx-auto flex w-full max-w-xl items-center justify-between rounded-full px-5 py-3">

          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              micOn
                ? 'bg-[#C7B8FF] text-[#0B1020]'
                : 'bg-white/10 text-white'
            }`}
            onClick={() =>
              setMicOn(
                (prev) => !prev
              )
            }
          >
            {micOn
              ? '🎙 Mic On'
              : '🔇 Mic Off'}
          </button>

          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              cameraOn
                ? 'bg-[#C7B8FF] text-[#0B1020]'
                : 'bg-white/10 text-white'
            }`}
            onClick={() => {

              const next =
                !cameraOn

              setCameraOn(next)

              streamRef.current
                ?.getVideoTracks()
                .forEach((track) => {
                  track.enabled = next
                })
            }}
          >
            {cameraOn
              ? '📹 On'
              : '📷 Off'}
          </button>

          <span className="tabular-nums text-sm text-gray-300">
            {formattedTime}
          </span>

          <PrimaryButton
            type="button"
            variant="danger"
            className="w-auto px-5 py-2"
            onClick={
              onEndInterview
            }
            disabled={
              submitting
            }
          >
            {submitting
              ? 'Ending…'
              : 'End Interview'}
          </PrimaryButton>
        </GlassCard>
      </div>
    </PageWrapper>
  )
}

export default InterviewLivePage