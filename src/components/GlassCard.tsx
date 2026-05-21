import type { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type GlassCardProps = PropsWithChildren<{
  className?: string
}>

function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={cn(
        `
        rounded-[20px]
        border
        p-6
        backdrop-blur-xl
        shadow-[0_0_45px_rgba(199,184,255,0.12)]

        bg-[var(--card-bg)]
        border-[var(--card-border)]
        text-[color:var(--text-primary)]
        `,
        className
      )}
    >
      {children}
    </div>
  )
}

export default GlassCard