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
  onTranscript,
}: {
  lang: string
  interim?: boolean
  continuous?: boolean
  enabled: boolean
  onTranscript: (payload: {
    finalText: string
    interimText: string
  }) => void
}) {

  const [status, setStatus] =
    useState<SpeechRecognitionStatus>(
      'idle'
    )

  const recognitionRef =
    useRef<RecognitionType | null>(
      null
    )

  const finalBufferRef =
    useRef('')

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

      try {

        recognitionRef.current?.stop()

      } catch {
        // ignore
      }

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
      continuous ?? false

    recognition.maxAlternatives = 1

    recognition.onstart = () => {

      console.log(
        'Speech recognition started'
      )

      setStatus('listening')
    }

    recognition.onresult = (
      event: any
    ) => {

      let interimText = ''

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i += 1
      ) {

        const result =
          event.results[i]

        const transcript =
          result?.[0]
            ?.transcript ?? ''

        if (result.isFinal) {

          finalBufferRef.current +=
            transcript + ' '

        } else {

          interimText += transcript
        }
      }

      onTranscript({
        finalText:
          finalBufferRef.current.trim(),

        interimText:
          interimText.trim(),
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

    recognition.onend = () => {

      console.log(
        'Speech recognition ended'
      )

      setStatus('idle')
    }

    recognitionRef.current =
      recognition

    finalBufferRef.current = ''

    try {

      recognition.start()

    } catch (error) {

      console.error(error)

      setStatus('error')
    }

    return () => {

      try {

        recognition.stop()

      } catch {
        // ignore
      }

      recognitionRef.current =
        null

      setStatus('idle')
    }

  }, [
    SpeechRecognitionCtor,
    enabled,
    lang,
    interim,
    continuous,
    onTranscript,
  ])

  return { status }
}