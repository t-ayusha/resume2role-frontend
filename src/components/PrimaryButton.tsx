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
      'bg-[#C7B8FF] hover:bg-[#B8A5FF] text-[#0B1020]',

    danger:
      'bg-red-500 hover:bg-red-600 text-white',
  }

  return (
    <button
      {...props}
      className={`rounded-xl px-5 py-3 font-medium transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default PrimaryButton