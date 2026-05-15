import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import GlassCard from './GlassCard'
import PrimaryButton from './PrimaryButton'

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { adminLogin, adminName } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const success = adminLogin(password)
    if (success) {
      // Find the name for the success message
      const ADMINS = {
        '22bcsj43': 'Ankita',
        '22bcsi54': 'Priyanka',
        '22bcti01': 'Ayusha',
        '22bcsi21': 'Laurina',
      }
      const name = ADMINS[password as keyof typeof ADMINS]
      setSuccess(`Welcome, ${name}!`)
      
      setTimeout(() => {
        onClose()
        setPassword('')
        setSuccess('')
      }, 2000)
    } else {
      setError('Unrecognised Login!')
    }
  }

  // To show the welcome name correctly, we can use a temporary variable or just use the adminName after state update
  // However, since we want to show it immediately, let's look up the name again or wait for state
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8 space-y-6 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                <p className="text-gray-400 text-sm">Enter your administrator password to continue.</p>
              </div>

              {success ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center text-green-400">
                  <p className="font-semibold text-lg">Successful Login!</p>
                  <p>Welcome back!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition focus:border-[#C7B8FF] focus:ring-2 focus:ring-[#C7B8FF]/35"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm ml-1"
                    >
                      {error}
                    </motion.p>
                  )}

                  <PrimaryButton type="submit" className="w-full">
                    Login as Admin
                  </PrimaryButton>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
