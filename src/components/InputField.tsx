import type { HTMLMotionProps } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type PrimaryButtonProps = PropsWithChildren<
  HTMLMotionProps<'button'> & {
    variant?: 'primary' | 'danger' | 'secondary'
  }
>

const variantStyles = {
  primary: `
    bg-[#C7B8FF]
    text-[#0B1020]
    hover:bg-[#d6cbff]
  `,

  danger: `
    bg-[#FF5C5C]
    text-white
    hover:bg-[#ff7474]
  `,

  secondary: `
    bg-[var(--card-bg)]
    text-[color:var(--text-primary)]
    border
    border-[var(--card-border)]
    hover:bg-[var(--card-hover)]
  `,
}

function PrimaryButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        `
        w-full
        rounded-full
        px-5
        py-3
        text-sm
        font-semibold
        transition
        duration-200
        `,
        variantStyles[variant],
        className
      )}
      {...(props as any)}
    >
      {children}
    </button>
  )
}

export default PrimaryButton