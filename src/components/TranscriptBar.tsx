type TranscriptBarProps = {
  question: string
}

function TranscriptBar({ question }: TranscriptBarProps) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5 shadow-[0_0_35px_rgba(199,184,255,0.1)]">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-400">Transcript</p>
      <p className="text-base text-white md:text-lg">{question}</p>
    </div>
  )
}

export default TranscriptBar
