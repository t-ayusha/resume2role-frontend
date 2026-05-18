import type { PropsWithChildren } from 'react'

type PageWrapperProps = PropsWithChildren<{
  className?: string
  innerClassName?: string
}>

function PageWrapper({ children, className = '', innerClassName = '' }: PageWrapperProps) {
  return (
    <main
      className={`relative min-h-screen text-[color:var(--text)] flex flex-col ${className}`}
    >
<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--overlay-dot),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--overlay-grid)_1px,transparent_1px),linear-gradient(90deg,var(--overlay-grid)_1px,transparent_1px)] bg-size-[54px_54px] opacity-30" />
      <div className={`relative z-10 w-full flex-1 flex flex-col ${innerClassName}`}>
        {children}
      </div>
    </main>
  )
}

export default PageWrapper
