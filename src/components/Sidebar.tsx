import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'MOC Interview', path: '/interview/setup', hideForAdmin: true },
  { label: 'Interview Prep', path: '/preparation' },
  { label: 'Profile', path: '/profile' },
]

interface SidebarProps {
  onClose?: () => void
  className?: string
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAuth()

  const handleNavClick = (path: string) => {
    navigate(path)
    if (onClose) onClose()
  }

  const filteredNavItems = navItems.filter(item => !isAdmin || !item.hideForAdmin)

  return (
    <aside className={cn(
      "sticky top-8 h-fit space-y-3 rounded-[20px] border border-white/10 bg-white/5 p-4",
      onClose ? "static" : "sticky",
      className
    )}>
      <div className="mb-4 flex items-center justify-between px-2">
        <p className="text-xl font-semibold tracking-wide text-[#C7B8FF]">Resume2Role</p>
        {onClose && (
          <button 
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <nav className="space-y-1 relative">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                'relative flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 outline-none',
                isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl bg-white/10 shadow-[0_0_15px_rgba(199,184,255,0.1)]"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
