import type { PropsWithChildren } from 'react'

type PageWrapperProps = PropsWithChildren<{
  className?: string
  innerClassName?: string
}>

function PageWrapper({ children, className = '', innerClassName = '' }: PageWrapperProps) {
  return (
    <main
      className={`relative min-h-screen text-white flex flex-col ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,184,255,0.2),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[54px_54px] opacity-30" />
      <div className={`relative z-10 w-full flex-1 flex flex-col ${innerClassName}`}>
        {children}
      </div>
    </main>
  )
}

export default PageWrapper
