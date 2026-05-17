import { useEffect, useMemo, useRef, useState } from 'react'

export type SpeechRecognitionStatus =
  | 'idle'
  | 'listening'
  | 'unsupported'
  | 'error'

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
  resetKey,
  onTranscript,
}: {
  lang: string
  interim?: boolean
  continuous?: boolean
  enabled: boolean
  resetKey?: number
  onTranscript: (payload: {
    finalText: string
    interimText: string
  }) => void
}) {
  const [status, setStatus] =
    useState<SpeechRecognitionStatus>('idle')

  const recognitionRef =
    useRef<RecognitionType | null>(null)

  const finalBufferRef = useRef('')

  const SpeechRecognitionCtor =
    useMemo(() => {
      const w = window as any

      return (
        w.SpeechRecognition ||
        w.webkitSpeechRecognition
      )
    }, [])

  useEffect(() => {
    if (!enabled) {
      recognitionRef.current?.stop()
      return
    }

    if (!SpeechRecognitionCtor) {
      setStatus('unsupported')
      return
    }

    const recognition: RecognitionType =
      new SpeechRecognitionCtor()

    recognition.lang = lang
    recognition.interimResults =
      interim ?? true

    recognition.continuous =
      continuous ?? true

    recognition.maxAlternatives = 1

    recognition.onresult = (
      event: any
    ) => {
      let interimText = ''

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i += 1
      ) {
        const res = event.results[i]

        const transcript =
          res?.[0]?.transcript ?? ''

        if (res.isFinal) {
          finalBufferRef.current +=
            transcript + ' '
        } else {
          interimText += transcript
        }
      }

      onTranscript({
        finalText:
          finalBufferRef.current.trim(),
        interimText: interimText.trim(),
      })
    }

    recognition.onerror = (
      event: any
    ) => {
      console.error(
        'Speech recognition error:',
        event
      )

      setStatus('error')
    }

    recognition.onstart = () => {
      console.log(
        'Speech recognition started'
      )

      setStatus('listening')
    }

    recognition.onend = () => {
      console.log(
        'Speech recognition ended'
      )

      // Auto restart if still enabled
      if (enabled) {
        try {
          recognition.start()
        } catch {
          //
        }
      }
    }

    recognitionRef.current = recognition

    finalBufferRef.current = ''

    try {
      recognition.start()
    } catch (err) {
      console.error(err)
      setStatus('error')
    }

    return () => {
      try {
        recognition.onend = null
        recognition.stop()
      } catch {
        //
      }

      recognitionRef.current = null
    }
  }, [
    SpeechRecognitionCtor,
    enabled,
    lang,
    interim,
    continuous,
    resetKey,
    onTranscript,
  ])

  return { status }
}