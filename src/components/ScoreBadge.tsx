type ScoreBadgeProps = {
  score: string
  label?: string
}

function ScoreBadge({ score, label }: ScoreBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-red-400/50 bg-red-500/20 px-4 py-1.5 text-sm font-semibold text-red-200">
      {label ? <span>{label}</span> : null}
      <span>{score}</span>
    </div>
  )
}

export default ScoreBadge
