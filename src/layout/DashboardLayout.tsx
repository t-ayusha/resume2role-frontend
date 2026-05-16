import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from './PageWrapper'
import { Sidebar } from '../components/Sidebar'

export function DashboardLayout({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <PageWrapper className="items-start">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-white/10 bg-[#0B1020]/50 px-4 py-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-xl font-semibold tracking-wide text-[#C7B8FF]">Resume2Role</p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-[240px_1fr]">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden lg:block" />

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 z-50 w-full max-w-[280px] p-4 lg:hidden"
                >
                  <Sidebar 
                    onClose={() => setIsSidebarOpen(false)} 
                    className="h-full w-full static" 
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main className="min-w-0 pb-12">
            {children}
          </main>
        </div>
      </div>
    </PageWrapper>
  )
}
