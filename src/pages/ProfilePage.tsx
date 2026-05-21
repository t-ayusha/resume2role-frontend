import { useMemo, useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import AppFooter from '../components/AppFooter'

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
  onSave: (
    details: ProfileDetails,
    avatar: string
  ) => void
}

function ProfileEditModal({
  isOpen,
  onClose,
  initialDetails,
  initialAvatar,
  onSave,
}: ProfileEditModalProps) {

  const [formData, setFormData] =
    useState(initialDetails)

  const [selectedAvatar, setSelectedAvatar] =
    useState(initialAvatar)

  useEffect(() => {
    if (isOpen) {
      setFormData(initialDetails)
      setSelectedAvatar(initialAvatar)
    }
  }, [
    isOpen,
    initialDetails,
    initialAvatar,
  ])

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    onSave(
      formData,
      selectedAvatar
    )

    onClose()
  }

  const profileImages =
    [] as Array<{
      id: string
      src: string
      label: string
    }>

  const DefaultAvatarIcon = () => (
    <div className="flex h-full w-full items-center justify-center bg-[var(--card-bg)]">
      <svg
        className="h-10 w-10 text-[color:var(--text-muted)]"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            className="relative w-full max-w-lg overflow-hidden rounded-4xl border border-[var(--card-border)] bg-[var(--bg-secondary)] p-8 shadow-2xl backdrop-blur-xl"
          >

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">
                Edit Profile
              </h2>

              <button
                onClick={onClose}
                className="rounded-full p-2 text-[color:var(--text-secondary)] transition-colors hover:bg-[var(--card-hover)] hover:text-[color:var(--text-primary)]"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div className="space-y-3">

                <p className="text-center text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">
                  Choose Profile Picture
                </p>

                <div className="flex justify-center gap-4">

                  {profileImages.map(
                    (img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() =>
                          setSelectedAvatar(
                            img.src
                          )
                        }
                        className={`group relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all ${
                          selectedAvatar ===
                          img.src
                            ? 'border-[#C7B8FF] scale-110 shadow-[0_0_15px_rgba(199,184,255,0.4)]'
                            : 'border-[var(--card-border)] hover:border-[#C7B8FF]/50'
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={img.label}
                          className="h-full w-full object-cover"
                        />

                        {selectedAvatar ===
                          img.src && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#C7B8FF]/20">
                            ✓
                          </div>
                        )}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAvatar(
                        'default'
                      )
                    }
                    className={`relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all ${
                      selectedAvatar ===
                      'default'
                        ? 'border-[#C7B8FF] scale-110 shadow-[0_0_15px_rgba(199,184,255,0.4)]'
                        : 'border-[var(--card-border)] hover:border-[#C7B8FF]/50'
                    }`}
                  >
                    <DefaultAvatarIcon />
                  </button>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">
                    Target Role
                  </span>

                  <input
                    type="text"
                    value={
                      formData.targetRole
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetRole:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition-all focus:border-[#C7B8FF] focus:ring-1 focus:ring-[#C7B8FF]/50"
                    placeholder="Frontend Developer"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">
                    City
                  </span>

                  <input
                    type="text"
                    value={
                      formData.city
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition-all focus:border-[#C7B8FF] focus:ring-1 focus:ring-[#C7B8FF]/50"
                    placeholder="San Francisco"
                  />
                </label>

              </div>

              <label className="block space-y-1.5">

                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">
                  Tech Stack
                </span>

                <input
                  type="text"
                  value={
                    formData.techStack
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      techStack:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition-all focus:border-[#C7B8FF] focus:ring-1 focus:ring-[#C7B8FF]/50"
                  placeholder="React, TypeScript"
                />

              </label>

              <label className="block space-y-1.5">

                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">
                  Phone Number
                </span>

                <input
                  type="text"
                  value={
                    formData.phone
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition-all focus:border-[#C7B8FF] focus:ring-1 focus:ring-[#C7B8FF]/50"
                  placeholder="+1 234 567 890"
                />

              </label>

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] py-3 text-sm font-bold text-[color:var(--text-primary)] transition-colors hover:bg-[var(--card-hover)]"
                >
                  Cancel
                </button>

                <PrimaryButton
                  type="submit"
                  className="flex-1 rounded-xl py-3 text-sm font-bold"
                >
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

const AvatarDisplay = ({
  url,
  className,
}: {
  url: string
  className?: string
}) => {

  if (url === 'default') {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--card-bg)] ${className}`}
      >
        <svg
          className="h-1/2 w-1/2 text-[color:var(--text-muted)]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={url}
      alt="Profile"
      className={`object-cover ${className}`}
    />
  )
}

function ProfilePage() {

  const {
    user,
    isAdmin,
    logout,
    updateUser,
  } = useAuth()

  const storageKeyTheme =
    'Resume2Role-theme'

  const getStoredTheme =
    () => {
      const stored =
        window.localStorage.getItem(
          storageKeyTheme
        )

      return stored ===
        'light' ||
        stored ===
          'dark'
        ? stored
        : 'dark'
    }

  const [theme, setTheme] =
    useState<
      'dark' | 'light'
    >(() =>
      getStoredTheme()
    )

  useEffect(() => {
    window.localStorage.setItem(
      storageKeyTheme,
      theme
    )

    document.documentElement.dataset.theme =
      theme
  }, [theme])

  const toggleTheme =
    () => {
      setTheme((t) =>
        t === 'dark'
          ? 'light'
          : 'dark'
      )
    }

  const storageKey = `Resume2Role-profile-details-${user?.id ?? 'guest'}`

  const [details, setDetails] =
    useState<ProfileDetails>(
      () => {
        const stored =
          window.localStorage.getItem(
            storageKey
          )

        return stored
          ? JSON.parse(
              stored
            )
          : {
              targetRole:
                '',
              techStack:
                '',
              phone: '',
              city: '',
            }
      }
    )

  const avatarUrl =
    user?.avatarUrl ??
    'default'

  const checklist =
    useMemo(
      () => [
        {
          label:
            'Full name',
          done:
            Boolean(
              user?.name
            ),
        },

        {
          label:
            'Email',
          done:
            Boolean(
              user?.email
            ),
        },

        {
          label:
            'Target role',
          done:
            Boolean(
              details.targetRole
            ),
        },

        {
          label:
            'Tech stack',
          done:
            Boolean(
              details.techStack
            ),
        },

        {
          label:
            'Phone number',
          done:
            Boolean(
              details.phone
            ),
        },

        {
          label:
            'City',
          done:
            Boolean(
              details.city
            ),
        },
      ],
      [
        details.city,
        details.phone,
        details.targetRole,
        details.techStack,
        user?.email,
        user?.name,
      ]
    )

  const completedCount =
    checklist.filter(
      (item) =>
        item.done
    ).length

  const completionPercent =
    Math.round(
      (completedCount /
        checklist.length) *
        100
    )

  const [
    isDetailsModalOpen,
    setIsDetailsModalOpen,
  ] = useState(false)

  const handleSave = (
    newDetails: ProfileDetails,
    newAvatar: string
  ) => {

    setDetails(
      newDetails
    )

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(
        newDetails
      )
    )

    updateUser({
      avatarUrl:
        newAvatar,
    })
  }

  return (
    <DashboardLayout>

      <section className="space-y-6">

        <GlassCard className="w-full space-y-8 p-8">

          <div
            className={`space-y-2 ${
              completionPercent ===
              100
                ? 'text-center'
                : ''
            }`}
          >

            <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
              Profile &
              Settings
            </h1>

            <p className="text-sm text-[color:var(--text-secondary)]">
              Manage your
              personal
              information and
              preferences.
            </p>

            <div className="flex justify-end">

              <button
                type="button"
                onClick={
                  toggleTheme
                }
                className="rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-xs font-semibold text-[color:var(--text-primary)] transition-colors hover:bg-[var(--card-hover)]"
              >
                Switch to{' '}
                {theme ===
                'dark'
                  ? 'Light'
                  : 'Dark'}{' '}
                theme
              </button>

            </div>

          </div>

          <motion.div
            layout
            className={
              completionPercent ===
              100
                ? 'flex justify-center'
                : 'grid gap-8 lg:grid-cols-[280px_1fr]'
            }
          >

            <motion.div
              layout
              className={`space-y-6 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-center shadow-xl ${
                completionPercent ===
                100
                  ? 'w-full max-w-[320px]'
                  : ''
              }`}
            >

              <div className="relative mx-auto h-32 w-32">

                <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#C7B8FF]/30 p-1">
                  <AvatarDisplay
                    url={
                      avatarUrl
                    }
                    className="h-full w-full rounded-full"
                  />
                </div>

                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-[var(--bg-secondary)] bg-green-500 shadow-lg" />

              </div>

              <div className="space-y-1">

                <p className="text-xl font-bold text-[color:var(--text-primary)]">
                  {user?.name ??
                    'Resume2Role User'}
                </p>

                <p className="text-sm text-[color:var(--text-secondary)]">
                  {user?.email ??
                    'No email set'}
                </p>

              </div>

              <PrimaryButton
                variant="secondary"
                className="w-full rounded-2xl"
                onClick={
                  logout
                }
              >
                Logout
              </PrimaryButton>

            </motion.div>

            <AnimatePresence mode="wait">

              {completionPercent <
                100 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  className="space-y-6 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-xl"
                >

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-bold uppercase tracking-wider text-[color:var(--text-secondary)]">
                      Profile
                      Completion
                    </p>

                    <span className="text-sm font-bold text-[#C7B8FF]">
                      {
                        completionPercent
                      }
                      %
                    </span>

                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--card-hover)]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7A5CFF] to-[#C7B8FF] transition-all duration-1000"
                      style={{
                        width: `${completionPercent}%`,
                      }}
                    />

                  </div>

                  <ul className="grid gap-3 sm:grid-cols-2">

                    {checklist.map(
                      (item) => (
                        <li
                          key={
                            item.label
                          }
                          className="flex items-center justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm"
                        >

                          <span className="text-[color:var(--text-secondary)]">
                            {
                              item.label
                            }
                          </span>

                          <span
                            className={`font-bold ${
                              item.done
                                ? 'text-green-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {item.done
                              ? '✓'
                              : '—'}
                          </span>

                        </li>
                      )
                    )}

                  </ul>

                </motion.div>
              )}

            </AnimatePresence>

          </motion.div>

          <div
            className={`grid gap-6 md:grid-cols-2 ${
              completionPercent ===
              100
                ? 'mx-auto max-w-2xl'
                : ''
            }`}
          >

            <div className="space-y-2">
              <p className="text-sm font-medium text-[color:var(--text-secondary)]">
                Target Role
              </p>

              <div className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 text-sm text-[color:var(--text-primary)]">
                {details.targetRole ||
                  'Not specified'}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-[color:var(--text-secondary)]">
                Tech Stack
              </p>

              <div className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 text-sm text-[color:var(--text-primary)]">
                {details.techStack ||
                  'Not specified'}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-[color:var(--text-secondary)]">
                Phone Number
              </p>

              <div className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 text-sm text-[color:var(--text-primary)]">
                {details.phone ||
                  'Not specified'}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-[color:var(--text-secondary)]">
                City
              </p>

              <div className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 text-sm text-[color:var(--text-primary)]">
                {details.city ||
                  'Not specified'}
              </div>
            </div>

          </div>

          <div
            className={`flex pt-4 ${
              completionPercent ===
              100
                ? 'justify-center'
                : 'justify-end'
            }`}
          >

            <PrimaryButton
              className="w-full md:w-auto md:px-12"
              onClick={() =>
                setIsDetailsModalOpen(
                  true
                )
              }
            >
              Edit Profile
            </PrimaryButton>

          </div>

        </GlassCard>

        <AppFooter />

      </section>

      <ProfileEditModal
        isOpen={
          isDetailsModalOpen
        }
        onClose={() =>
          setIsDetailsModalOpen(
            false
          )
        }
        initialDetails={
          details
        }
        initialAvatar={
          avatarUrl
        }
        onSave={handleSave}
      />

    </DashboardLayout>
  )
}

export default ProfilePage