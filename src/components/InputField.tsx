import type { HTMLMotionProps } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type PrimaryButtonProps = PropsWithChildren<
  HTMLMotionProps<'button'> & {
    variant?: 'primary' | 'danger' | 'secondary'
  }
>

const variantStyles = {
  primary: 'bg-[#C7B8FF] text-[#0B1020] hover:bg-[#d6cbff]',
  danger: 'bg-[#FF5C5C] text-white hover:bg-[#ff7474]',
  secondary: 'bg-white/10 text-white hover:bg-white/15',
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
        'w-full rounded-full px-5 py-3 text-sm font-semibold transition',
        variantStyles[variant],
        className
      )}
      {...props as any}
    >
      {children}
    </button>
  )
}

export default PrimaryButton