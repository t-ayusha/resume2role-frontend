import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'
import { useReducedMotion } from '../hooks/useReducedMotion'

type GlassCardProps = PropsWithChildren<{
  className?: string
}>

function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-white/10 bg-white/5 p-6 shadow-[0_0_45px_rgba(199,184,255,0.12)] backdrop-blur-xl',
        className
      )}
    >
      {children}
    </div>
  )
}

export default GlassCard
