import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
//import f1 from '../assets/profile_img/f1.jpg'
//import f2 from '../assets/profile_img/f2.jpg'
//import m1 from '../assets/profile_img/m1.jpg'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import AppFooter from '../components/AppFooter'
import PageWrapper from '../layout/PageWrapper'
import { useAuth } from '../context/AuthContext'
import { DashboardLayout } from '../layout/DashboardLayout'

type ProfileDetails = {
  targetRole: string
  techStack: string
  phone: string
  city: string
}

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  initialDetails: ProfileDetails
  initialAvatar: string
  onSave: (details: ProfileDetails, avatar: string) => void
}

function ProfileEditModal({ isOpen, onClose, initialDetails, initialAvatar, onSave }: ProfileEditModalProps) {
  const [formData, setFormData] = useState(initialDetails)
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar)

  useEffect(() => {
    if (isOpen) {
      setFormData(initialDetails)
      setSelectedAvatar(initialAvatar)
    }
  }, [isOpen, initialDetails, initialAvatar])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData, selectedAvatar)
    onClose()
  }

  // const profileImages = [
  //   { id: 'm1', src: m1, label: 'Male 1' },
  //   { id: 'f1', src: f1, label: 'Female 1' },
  //   { id: 'f2', src: f2, label: 'Female 2' },
  // ]

  const DefaultAvatarIcon = () => (
    <div className="flex h-full w-full items-center justify-center bg-[#1A1F2E]">
      <svg className="h-10 w-10 text-white/20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#0B1020]/90 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <p className="text-center text-xs font-semibold uppercase tracking-wider text-white/40">Choose Profile Picture</p>
                <div className="flex justify-center gap-4">
                  {profileImages.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedAvatar(img.src)}
                      className={`group relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all ${
                        selectedAvatar === img.src 
                          ? 'border-[#C7B8FF] scale-110 shadow-[0_0_15px_rgba(199,184,255,0.4)]' 
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                      {selectedAvatar === img.src && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#C7B8FF]/20">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedAvatar('default')}
                    className={`relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all ${
                      selectedAvatar === 'default' 
                        ? 'border-[#C7B8FF] scale-110 shadow-[0_0_15px_rgba(199,184,255,0.4)]' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <DefaultAvatarIcon />
                    {selectedAvatar === 'default' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#C7B8FF]/20">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Target Role</span>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#C7B8FF] focus:ring-1 focus:ring-[#C7B8FF]/50 transition-all"
                    placeholder="e.g. Frontend Developer"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/40">City</span>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#C7B8FF] focus:ring-1 focus:ring-[#C7B8FF]/50 transition-all"
                    placeholder="e.g. San Francisco, CA"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Tech Stack</span>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#C7B8FF] focus:ring-1 focus:ring-[#C7B8FF]/50 transition-all"
                  placeholder="e.g. React, TypeScript, Tailwind"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Phone Number</span>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#C7B8FF] focus:ring-1 focus:ring-[#C7B8FF]/50 transition-all"
                  placeholder="e.g. +1 234 567 890"
                />
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
                <PrimaryButton type="submit" className="flex-1 rounded-xl py-3 text-sm font-bold">
                  Save Changes
                </PrimaryButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const AvatarDisplay = ({ url, className }: { url: string; className?: string }) => {
  if (url === 'default') {
    return (
      <div className={`flex items-center justify-center bg-[#1A1F2E] ${className}`}>
        <svg className="h-1/2 w-1/2 text-white/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    )
  }
  return <img src={url} alt="Profile" className={`object-cover ${className}`} />
}

function ProfilePage() {
  const { user, isAdmin, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const storageKey = `prepwise-profile-details-${user?.id ?? 'guest'}`
  const [details, setDetails] = useState<ProfileDetails>(() => {
    const stored = window.localStorage.getItem(storageKey)
    return stored
      ? (JSON.parse(stored) as ProfileDetails)
      : {
          targetRole: '',
          techStack: '',
          phone: '',
          city: '',
        }
  })

  const avatarUrl = user?.avatarUrl ?? 'default'

  const checklist = useMemo(
    () => [
      { label: 'Full name', done: Boolean(user?.name) },
      { label: 'Email', done: Boolean(user?.email) },
      { label: 'Target role', done: Boolean(details.targetRole) },
      { label: 'Tech stack', done: Boolean(details.techStack) },
      { label: 'Phone number', done: Boolean(details.phone) },
      { label: 'City', done: Boolean(details.city) },
    ],
    [details.city, details.phone, details.targetRole, details.techStack, user?.email, user?.name],
  )

  const completedCount = checklist.filter((item) => item.done).length
  const completionPercent = Math.round((completedCount / checklist.length) * 100)

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  if (isAdmin) {
    return (
      <DashboardLayout>
        <section className="space-y-6">
          <GlassCard className="w-full space-y-8 p-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-semibold">Admin Profile</h1>
              <p className="text-sm text-white/40">Manage your administrative account.</p>
            </div>

            <div className="flex justify-center">
              <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl w-full max-w-[320px]">
                <div className="relative mx-auto h-32 w-32">
                  <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#C7B8FF]/30 p-1">
                    <AvatarDisplay url={avatarUrl} className="h-full w-full rounded-full" />
                  </div>
                  <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-[#0B1020] bg-green-500 shadow-lg" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-white">{user?.name ?? 'Admin User'}</p>
                  <p className="text-sm text-white/40">{user?.email ?? 'admin@prepwise.com'}</p>
                </div>
                <PrimaryButton variant="secondary" className="w-full rounded-2xl" onClick={logout}>
                  Logout
                </PrimaryButton>
              </div>
            </div>
          </GlassCard>
          <AppFooter />
        </section>
      </DashboardLayout>
    )
  }

  const handleSave = (newDetails: ProfileDetails, newAvatar: string) => {
    setDetails(newDetails)
    window.localStorage.setItem(storageKey, JSON.stringify(newDetails))
    updateUser({ avatarUrl: newAvatar })
  }

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <GlassCard className="w-full space-y-8 p-8">
          <div className={`space-y-2 ${completionPercent === 100 ? 'text-center' : ''}`}>
            <h1 className="text-3xl font-semibold">Profile & Settings</h1>
            <p className="text-sm text-white/40">Manage your personal information and preferences.</p>
          </div>

          <motion.div 
            layout
            className={completionPercent === 100 ? 'flex justify-center' : 'grid gap-8 lg:grid-cols-[280px_1fr]'}
          >
            <motion.div 
              layout
              className={`space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl ${completionPercent === 100 ? 'w-full max-w-[320px]' : ''}`}
            >
              <div className="relative mx-auto h-32 w-32">
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#C7B8FF]/30 p-1">
                  <AvatarDisplay url={avatarUrl} className="h-full w-full rounded-full" />
                </div>
                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-[#0B1020] bg-green-500 shadow-lg" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-white">{user?.name ?? 'PrepWise User'}</p>
                <p className="text-sm text-white/40">{user?.email ?? 'No email set'}</p>
              </div>
              <PrimaryButton variant="secondary" className="w-full rounded-2xl" onClick={logout}>
                Logout
              </PrimaryButton>
            </motion.div>

            <AnimatePresence mode="wait">
              {completionPercent < 100 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold uppercase tracking-wider text-white/60">Profile Completion</p>
                    <span className="text-sm font-bold text-[#C7B8FF]">{completionPercent}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#7A5CFF] to-[#C7B8FF] transition-all duration-1000" 
                      style={{ width: `${completionPercent}%` }} 
                    />
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {checklist.map((item) => (
                      <li key={item.label} className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-sm">
                        <span className="text-white/60">{item.label}</span>
                        <span className={`font-bold ${item.done ? 'text-green-400' : 'text-amber-400'}`}>
                          {item.done ? '✓' : '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className={`grid gap-6 md:grid-cols-2 ${completionPercent === 100 ? 'max-w-2xl mx-auto' : ''}`}>
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/60">Target Role</p>
              <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white opacity-60">
                {details.targetRole || 'Not specified'}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/60">Tech Stack</p>
              <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white opacity-60">
                {details.techStack || 'Not specified'}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/60">Phone Number</p>
              <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white opacity-60">
                {details.phone || 'Not specified'}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/60">City</p>
              <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white opacity-60">
                {details.city || 'Not specified'}
              </div>
            </div>
          </div>

          <div className={`flex pt-4 ${completionPercent === 100 ? 'justify-center' : 'justify-end'}`}>
            <PrimaryButton 
              className="w-full md:w-auto md:px-12" 
              onClick={() => setIsDetailsModalOpen(true)}
            >
              Edit Profile
            </PrimaryButton>
          </div>
        </GlassCard>

        <AppFooter />
      </section>

      <ProfileEditModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)}
        initialDetails={details}
        initialAvatar={avatarUrl}
        onSave={handleSave}
      />
    </DashboardLayout>
  )
}

export default ProfilePage
