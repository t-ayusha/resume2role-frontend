let activeUtterance:
  | SpeechSynthesisUtterance
  | null = null

export function stopSpeaking() {
  if (
    typeof window ===
    'undefined'
  ) {
    return
  }

  window.speechSynthesis.cancel()

  activeUtterance = null
}

function cleanText(
  text: string
) {
  return text
    .replace(/\\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\d+\.\s*/g, '')
    .trim()
}

export async function speakText(
  text: string
): Promise<void> {
  if (
    typeof window ===
    'undefined'
  ) {
    return
  }

  const synth =
    window.speechSynthesis

  if (
    !synth ||
    typeof SpeechSynthesisUtterance ===
      'undefined'
  ) {
    return
  }

  stopSpeaking()

  const cleaned =
    cleanText(text)

  if (!cleaned) {
    return
  }

  return new Promise(
    (resolve) => {
      const utterance =
        new SpeechSynthesisUtterance(
          cleaned
        )

      activeUtterance =
        utterance

      const voices =
        synth.getVoices?.() ||
        []

      const preferredVoice =
        voices.find(
          (voice) =>
            /en/i.test(
              voice.lang
            )
        )

      if (
        preferredVoice
      ) {
        utterance.voice =
          preferredVoice
      }

      utterance.rate =
        0.95

      utterance.pitch =
        1

      utterance.volume =
        1

      utterance.onend =
        () => {
          if (
            activeUtterance ===
            utterance
          ) {
            activeUtterance =
              null
          }

          resolve()
        }

      utterance.onerror =
        () => {
          if (
            activeUtterance ===
            utterance
          ) {
            activeUtterance =
              null
          }

          resolve()
        }

      synth.speak(
        utterance
      )
    }
  )
}