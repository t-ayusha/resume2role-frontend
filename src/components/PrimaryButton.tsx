import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type Variant =
  | 'primary'
  | 'secondary'
  | 'danger'

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
    variant?: Variant
  }

function PrimaryButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}: Props) {

  const variants = {
    primary:
      'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',

    secondary:
      `
      bg-[var(--card-bg)]
      hover:bg-[var(--card-hover)]
      text-[color:var(--text-primary)]
      border
      border-[var(--card-border)]
      `,

    danger:
      'bg-red-500 hover:bg-red-600 text-white',
  }

  return (
    <button
      {...props}
      className={`
        rounded-xl
        px-5
        py-3
        font-medium
        transition-all
        duration-200
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default PrimaryButton