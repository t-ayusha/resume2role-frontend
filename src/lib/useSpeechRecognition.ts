import { useEffect, useMemo, useRef, useState } from 'react'

export type SpeechRecognitionStatus = 'idle' | 'listening' | 'unsupported' | 'error'

type RecognitionType = {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onstart: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

export function useSpeechRecognition({
  lang,
  interim,
  continuous,
  enabled,
  onTranscript,
}: {
  lang: string
  interim?: boolean
  continuous?: boolean
  enabled: boolean
  onTranscript: (payload: { finalText: string; interimText: string }) => void
}) {
  const [status, setStatus] = useState<SpeechRecognitionStatus>('idle')
  const recognitionRef = useRef<RecognitionType | null>(null)
  const finalBufferRef = useRef('')

  const SpeechRecognitionCtor = useMemo(() => {
    const w = window as any
    return w.SpeechRecognition || w.webkitSpeechRecognition
  }, [])

  useEffect(() => {
    if (!enabled) return

    if (!SpeechRecognitionCtor) {
      setStatus('unsupported')
      return
    }

    const recognition: RecognitionType = new SpeechRecognitionCtor()
    recognition.lang = lang
    recognition.interimResults = interim ?? true
    // Web Speech API is inconsistent across browsers; continuous improves repeated utterances.
    // Keep it enabled when caller requests continuous.
    recognition.continuous = continuous ?? false
    recognition.maxAlternatives = 1
    recognition.interimResults = interim ?? true



    recognition.onresult = (event: any) => {
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i]
        const transcript = res?.[0]?.transcript ?? ''
        if (res.isFinal) {
          finalBufferRef.current += transcript
          finalBufferRef.current += ' '
        } else {
          interimText += transcript
        }
      }

      const finalText = finalBufferRef.current.trim()
      onTranscript({ finalText, interimText: interimText.trim() })
    }


    recognition.onerror = () => {
      setStatus('error')
    }
recognition.onstart = () => {
  console.log('Recognition actually started')
}
    recognition.onend = () => {
  console.log('Speech recognition ended')
}

    recognitionRef.current = recognition
    finalBufferRef.current = ''

    try {
      recognition.start()
      console.log('Starting speech recognition...')
      setStatus('listening')
    } catch {
      setStatus('error')
    }

    return () => {
      try {
        recognition.stop()
      } catch {
        // ignore
      }
      recognitionRef.current = null
      setStatus('idle')
      finalBufferRef.current = ''
    }
  }, [SpeechRecognitionCtor, enabled, lang, interim, continuous, onTranscript])

  return { status }
}

