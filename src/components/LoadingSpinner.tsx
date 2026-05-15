interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#C7B8FF]" />
      <p className="text-sm text-white/40">{message}</p>
    </div>
  )
}
