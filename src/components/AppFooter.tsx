import { useState } from 'react'
import AdminLoginModal from './AdminLoginModal'
import { useAuth } from '../context/AuthContext'

function AppFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAdmin, adminName, adminLogout } = useAuth()

  return (
    <footer className="mt-auto w-full space-y-8 py-12 px-6">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Logo & Moto */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Resume2Role</h2>
          <p className="max-w-md text-gray-400 text-sm leading-relaxed">
            Resume2Role is an AI-powered mock interview platform where you will find great tools for 
            mastering technical interviews. Each session is designed to help you succeed 
            with real-time feedback and detailed insights.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          {[
            { name: 'Facebook', icon: 'F' },
            { name: 'Twitter', icon: 'T' },
            { name: 'Google', icon: 'G+' },
            { name: 'YouTube', icon: 'Y' },
            { name: 'LinkedIn', icon: 'in' },
          ].map((social) => (
            <button
              key={social.name}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-[#C7B8FF] hover:bg-[#C7B8FF]/10"
              title={social.name}
            >
              <span className="text-sm font-bold text-gray-400 transition-colors group-hover:text-[#C7B8FF]">
                {social.icon}
              </span>
            </button>
          ))}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium">
          {['Home', 'About', 'Contact', 'Blog', 'Articles'].map((link) => (
            <button key={link} className="text-gray-400 transition-colors hover:text-white">
              {link}
            </button>
          ))}
        </div>

        {/* Admin Section */}
        <div className="pt-4 border-t border-white/5 w-full flex flex-col items-center gap-4">
          {isAdmin ? (
            <div className="flex items-center gap-4">
              <span className="text-green-400 text-sm font-medium">
                Admin: {adminName}
              </span>
              <button 
                onClick={adminLogout}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors underline underline-offset-4"
              >
                Logout Admin
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-semibold text-gray-400 transition-all hover:border-[#C7B8FF] hover:text-white"
            >
              ADMIN LOGIN
            </button>
          )}
          
          <p className="text-xs text-gray-500">
            Design By - <span className="text-gray-400">Resume2Role Team</span>
          </p>
        </div>
      </div>

      <AdminLoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </footer>
  )
}

export default AppFooter

