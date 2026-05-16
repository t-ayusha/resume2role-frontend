import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import TranscriptBar from '../components/TranscriptBar'
import { interviewQuestions } from '../data/mockInterview'
import { completeInterviewApi } from '../lib/api'
import { postIceCandidateToBackend, postOfferToBackend } from '../lib/webrtcDemo'
import { speakText } from '../lib/textToSpeech'
import { useSpeechRecognition } from '../lib/useSpeechRecognition'
import { useAuth } from '../context/AuthContext'
import PageWrapper from '../layout/PageWrapper'

function InterviewLivePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const { hasResume, resumeName, role, type } =
    (location.state as { hasResume?: boolean; resumeName?: string; role?: string; type?: string }) || {}

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const transcriptRef = useRef<string>('')

  const [aiConnected, setAiConnected] = useState(false)
  const [webrtcError, setWebrtcError] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [mediaError, setMediaError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [hasSpokenForCurrentQuestion, setHasSpokenForCurrentQuestion] = useState(false)

  const questions = useMemo(() => {
    if (hasResume) {
      return [
        `Based on your resume as a ${role}, tell me about your most challenging project.`,
        `I see you've mentioned skills relevant to ${role}. How do you stay updated?`,
        ...interviewQuestions.slice(2),
      ]
    }
    return interviewQuestions
  }, [hasResume, role])

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((prev) => prev + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!micOn || submitting) return
    const t = window.setTimeout(() => {
      if (!hasSpokenForCurrentQuestion) {
        transcriptRef.current = ''
        setTranscript('')
        setHasSpokenForCurrentQuestion(false)
        setQuestionIndex((prev) => (prev + 1) % questions.length)
      }
    }, 10_000)
    return () => window.clearTimeout(t)
  }, [hasSpokenForCurrentQuestion, micOn, submitting, questions.length])

  useEffect(() => {
    const q = questions[questionIndex]
    if (!q) return
    void speakText(q)
  }, [questionIndex, questions])

  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streamRef.current = stream
        console.log('Audio Tracks:', stream.getAudioTracks())
        if (videoRef.current) videoRef.current.srcObject = stream
        setMediaError('')
      } catch {
        setMediaError('Camera/microphone permission denied. Allow access to use live media.')
      }
    }
    void setupMedia()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      pcRef.current?.getSenders().forEach((s) => { try { s.track?.stop() } catch { /* ignore */ } })
      pcRef.current?.close()
      pcRef.current = null
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = micOn })
  }, [micOn])

  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = cameraOn })
  }, [cameraOn])

  useEffect(() => {
    const startWebRTC = async () => {
      if (!streamRef.current || pcRef.current) return
      try {
        setWebrtcError('')
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
        pcRef.current = pc
        pc.ontrack = (e) => {
          const s = e.streams[0]
          if (remoteVideoRef.current && s) { remoteVideoRef.current.srcObject = s; setAiConnected(true) }
        }
        pc.onicecandidate = async (e) => {
          if (!e.candidate) return
          try {
            await postIceCandidateToBackend({ candidate: { candidate: e.candidate.candidate, sdpMid: e.candidate.sdpMid, sdpMLineIndex: e.candidate.sdpMLineIndex } })
          } catch { /* non-fatal */ }
        }
        streamRef.current.getTracks().forEach((t) => pc.addTrack(t, streamRef.current as MediaStream))
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        const resp = await postOfferToBackend({ offer: { type: offer.type, sdp: offer.sdp || '' } })
        if (!resp.answer) { setWebrtcError(resp.message || 'AI interviewer not connected (demo mode).'); return }
        await pc.setRemoteDescription({ type: 'answer', sdp: resp.answer })
      } catch {
        setWebrtcError('Failed to initialize WebRTC.')
      }
    }
    void startWebRTC()
  }, [])

  const formattedTime = useMemo(() => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0')
    const sec = String(seconds % 60).padStart(2, '0')
    return `${min}:${sec}`
  }, [seconds])

  const handleTranscript = useCallback(
  ({ finalText, interimText }: { finalText: string; interimText: string }) => {

    const combined = `${finalText} ${interimText}`.trim()

    console.log('Transcript Received:', combined)

    setTranscript(combined)

    transcriptRef.current = combined

    if (combined.length > 0) {
      setHasSpokenForCurrentQuestion(true)
    }
  },
  []
)

  useSpeechRecognition({ lang: 'en-US', interim: true, continuous: true, enabled: micOn && !submitting, onTranscript: handleTranscript })

  const nextQuestion = () => {
    transcriptRef.current = ''
    setTranscript('')
    setHasSpokenForCurrentQuestion(false)
    setQuestionIndex((prev) => (prev + 1) % questions.length)
  }

  const onEndInterview = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const report = await completeInterviewApi({ role: role || 'Frontend Developer', type: type || 'Technical' })
      navigate(`/interview/report?id=${report.id}`, {
        state: { report: { ...report, accuracy: Math.floor(Math.random() * 21 + 75) } },
      })
    } catch {
      navigate('/interview/report')
    } finally {
      setSubmitting(false)
    }
  }

  const userAvatarUrl = user?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'

  return (
    <PageWrapper className="items-start" innerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold tracking-wide text-[#C7B8FF]">PrepWise</p>
          <div className="flex items-center gap-3">
            {hasResume && (
              <span className="hidden md:block text-xs text-[#C7B8FF] bg-[#C7B8FF]/10 px-3 py-1 rounded-full border border-[#C7B8FF]/20">
                AI analyzing: {resumeName}
              </span>
            )}
            <img src={userAvatarUrl} alt="User avatar" className="h-10 w-10 rounded-full border border-white/20 object-cover" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold md:text-3xl">
            {hasResume ? `Resume Interview: ${role}` : `${role || 'Frontend Developer'} Interview`}
          </h1>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-gray-100">{type || 'Technical'}</span>
        </div>

        <GlassCard className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/5 p-6 text-center">
              <div className="mb-4 h-44 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                {webrtcError ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-sm text-gray-300">
                    <div className="font-semibold text-gray-100">AI Interviewer</div>
                    <div className="text-xs text-white/40">{webrtcError}</div>
                  </div>
                ) : (
                  <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover"
                    onLoadedMetadata={() => remoteVideoRef.current?.play?.().catch(() => {})} />
                )}
              </div>
              <p className="text-lg font-semibold">AI Interviewer {aiConnected && <span className="text-sm text-[#C7B8FF]">(Connected)</span>}</p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/5 p-6 text-center">
              <div className="mb-4 h-44 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                {mediaError || !cameraOn ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-300">{mediaError || 'Camera is off'}</div>
                ) : (
                  <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                )}
              </div>
              <p className="text-lg font-semibold">{user?.name || 'You'} (You)</p>
            </div>
          </div>

          <TranscriptBar question={questions[questionIndex]} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">  
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-400">Your Answer</p>
              <p className="min-h-12 text-base text-white md:text-lg">{transcript || 'Listening…'}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-400">Session Info</p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Question {questionIndex + 1} of {questions.length}</p>
                <p>Elapsed: {formattedTime}</p>
                <p className={micOn ? 'text-green-400' : 'text-red-400'}>{micOn ? '🎙 Mic on' : '🔇 Mic off'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton variant="secondary" className="w-auto" type="button" onClick={nextQuestion}>Next Question</PrimaryButton>
            <PrimaryButton variant="danger" className="w-auto" type="button" onClick={onEndInterview} disabled={submitting}>
              {submitting ? 'Ending…' : 'Leave Interview'}
            </PrimaryButton>
          </div>
        </GlassCard>

        <GlassCard className="mx-auto flex w-full max-w-xl items-center justify-between rounded-full px-5 py-3">
          <button type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${micOn ? 'bg-[#C7B8FF] text-[#0B1020]' : 'bg-white/10 text-white'}`}
            onClick={() => setMicOn((p) => !p)}>
            {micOn ? '🎙 Mic On' : '🔇 Mic Off'}
          </button>
          <button type="button"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${cameraOn ? 'bg-[#C7B8FF] text-[#0B1020]' : 'bg-white/10 text-white'}`}
            onClick={() => setCameraOn((p) => !p)}>
            {cameraOn ? '📹 On' : '📷 Off'}
          </button>
          <span className="tabular-nums text-sm text-gray-300">{formattedTime}</span>
          <PrimaryButton type="button" variant="danger" className="w-auto px-5 py-2" onClick={onEndInterview} disabled={submitting}>
            {submitting ? 'Ending…' : 'End Interview'}
          </PrimaryButton>
        </GlassCard>
      </div>
    </PageWrapper>
  )
}

export default InterviewLivePage
