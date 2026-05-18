export async function speakText(text: string): Promise<void> {
  const trimmed = text.trim()
  if (!trimmed) return

  // Use Web Speech API (works in modern Chromium/Edge; fallback is no-op)
  if (typeof window === 'undefined') return
  const synth = window.speechSynthesis
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return

  // Cancel any ongoing speech to keep it in sync with question updates
  synth.cancel()

  return new Promise((resolve) => {
    // Lightly “humanize” by splitting into sentences and adding tiny pacing variance.
    // speechSynthesis implementations still vary by browser, but this reduces the robotic cadence.
    const sentences = trimmed
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)

    const speakSentence = (idx: number) => {
      if (idx >= sentences.length) {
        resolve()
        return
      }

      const utterance = new SpeechSynthesisUtterance(sentences[idx])

      // Prefer an English voice if available
      const voices = synth.getVoices?.() ?? []
      const preferred = voices.find((v) => /en/i.test(v.lang))
      if (preferred) utterance.voice = preferred

      // Human-like tweaks (small randomization)
      const rateBase = 0.95
      const pitchBase = 1.05
      const rateJitter = (Math.random() - 0.5) * 0.06 // +/- 0.03
      const pitchJitter = (Math.random() - 0.5) * 0.08 // +/- 0.04

      utterance.rate = Math.max(0.85, Math.min(1.0, rateBase + rateJitter))
      utterance.pitch = Math.max(0.9, Math.min(1.2, pitchBase + pitchJitter))
      utterance.volume = 1

      // Resolve/chain after each sentence
      utterance.onend = () => {
        // micro pause between sentences
        window.setTimeout(() => speakSentence(idx + 1), 180)
      }
      utterance.onerror = () => resolve()

      synth.speak(utterance)
    }

    // Cancel any ongoing speech before we start the sequence
    synth.cancel()
    speakSentence(0)
  })
}


