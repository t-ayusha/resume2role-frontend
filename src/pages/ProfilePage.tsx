import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import { useAuth } from '../context/AuthContext'

const API_BASE_URL =
  'http://localhost:8080/api'

type ProfileData = {
  id?: string | null
  email: string
  fullName: string
  targetRole: string
  techStack: string
  phone: string
  city: string
  avatar: string
}

const emptyProfile: ProfileData = {
  email: '',
  fullName: '',
  targetRole: '',
  techStack: '',
  phone: '',
  city: '',
  avatar: '',
}

function ProfilePage() {
  const { user, logout } = useAuth()

  const [profile, setProfile] =
    useState<ProfileData>(emptyProfile)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [editing, setEditing] =
    useState(false)

  const [error, setError] =
    useState('')

  const completionPercentage =
    useMemo(() => {
      const fields = [
        profile.fullName,
        profile.email,
        profile.targetRole,
        profile.techStack,
        profile.phone,
        profile.city,
      ]

      const completed =
        fields.filter(
          (field) =>
            field &&
            field.trim() !== ''
        ).length

      return Math.round(
        (completed / fields.length) * 100
      )
    }, [profile])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)

        const email =
          user?.email || ''

        if (!email) {
          setLoading(false)
          return
        }

        const response = await fetch(
          `${API_BASE_URL}/profile/${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                'token'
              )}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error(
            'Failed to fetch profile'
          )
        }

        const data = await response.json()

        setProfile({
          id: data.id ?? null,
          email: data.email ?? '',
          fullName:
            data.fullName ?? '',
          targetRole:
            data.targetRole ?? '',
          techStack:
            data.techStack ?? '',
          phone: data.phone ?? '',
          city: data.city ?? '',
          avatar: data.avatar ?? '',
        })
      } catch (err) {
        console.error(err)

        setError(
          'Unable to load profile'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.email])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } =
      e.target

    if (
      name === 'phone' &&
      value.length > 10
    ) {
      return
    }

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setError('')

      if (
        !/^[0-9]{10}$/.test(
          profile.phone
        )
      ) {
        setError(
          'Enter a valid 10 digit phone number'
        )
        return
      }

      if (
        profile.fullName.trim() === ''
      ) {
        setError(
          'Full name is required'
        )
        return
      }

      if (
        profile.email.trim() === ''
      ) {
        setError(
          'Email is required'
        )
        return
      }

      setSaving(true)

      const payload = {
        email: profile.email,
        fullName: profile.fullName,
        targetRole:
          profile.targetRole,
        techStack:
          profile.techStack,
        phone: profile.phone,
        city: profile.city,
        avatar:
          profile.avatar || '',
      }

      const response = await fetch(
        `${API_BASE_URL}/profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${localStorage.getItem(
              'token'
            )}`,
          },
          body: JSON.stringify(
            payload
          ),
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to save profile'
        )
      }

      const updated =
        await response.json()

      setProfile(updated)

      setEditing(false)

      setError('')
    } catch (err) {
      console.error(err)

      setError(
        'Failed to save profile'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10">
        <Sidebar />

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex-1"
        >
          <GlassCard className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold">
                Profile & Settings
              </h1>

              <p className="mt-2 text-sm text-white/60">
                Manage your personal
                information and
                preferences.
              </p>
            </div>

            {loading ? (
              <div className="py-20 text-center text-white/70">
                Loading profile...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <GlassCard className="rounded-3xl border border-white/10 bg-white/5 p-8">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-violet-400/30 bg-[#0b1120] text-5xl">
                          👤
                        </div>

                        <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-[#050816] bg-emerald-400" />
                      </div>

                      <h2 className="text-2xl font-semibold">
                        {profile.fullName ||
                          'User'}
                      </h2>

                      <p className="mt-2 text-white/60">
                        {profile.email}
                      </p>

                      <button
                        onClick={logout}
                        className="mt-8 rounded-2xl bg-violet-400 px-8 py-3 font-medium text-black transition hover:bg-violet-300"
                      >
                        Logout
                      </button>
                    </div>
                  </GlassCard>

                  <GlassCard className="rounded-3xl border border-white/10 bg-white/5 p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                        Profile Completion
                      </h3>

                      <span className="text-sm font-medium text-violet-300">
                        {
                          completionPercentage
                        }
                        %
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600 transition-all duration-500"
                        style={{
                          width: `${completionPercentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-10 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-6xl font-bold text-violet-300">
                          {
                            completionPercentage
                          }
                          %
                        </p>

                        <p className="mt-3 text-sm text-white/60">
                          Profile Completed
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      label:
                        'Full Name',
                      name: 'fullName',
                      type: 'text',
                    },
                    {
                      label: 'Email',
                      name: 'email',
                      type: 'email',
                    },
                    {
                      label:
                        'Target Role',
                      name: 'targetRole',
                      type: 'text',
                    },
                    {
                      label:
                        'Tech Stack',
                      name: 'techStack',
                      type: 'text',
                    },
                    {
                      label:
                        'Phone Number',
                      name: 'phone',
                      type: 'tel',
                    },
                    {
                      label: 'City',
                      name: 'city',
                      type: 'text',
                    },
                  ].map((field) => (
                    <div
                      key={field.name}
                    >
                      <label className="mb-2 block text-sm text-white/70">
                        {field.label}
                      </label>

                      <input
                        type={field.type}
                        name={field.name}
                        disabled={!editing}
                        value={
                          profile[
                            field.name as keyof ProfileData
                          ] as string
                        }
                        onChange={
                          handleChange
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition focus:border-violet-400 disabled:opacity-70"
                        placeholder={`Enter ${field.label}`}
                      />
                    </div>
                  ))}
                </div>

                {error && (
                  <p className="mt-6 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <div className="mt-10 flex justify-end gap-4">
                  {editing && (
                    <button
                      onClick={() =>
                        setEditing(
                          false
                        )
                      }
                      className="rounded-2xl border border-white/10 px-6 py-3"
                    >
                      Cancel
                    </button>
                  )}

                  {editing ? (
                    <button
                      onClick={
                        handleSave
                      }
                      disabled={saving}
                      className="rounded-2xl bg-violet-500 px-8 py-3 font-medium transition hover:bg-violet-400"
                    >
                      {saving
                        ? 'Saving...'
                        : 'Save Profile'}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setEditing(
                          true
                        )
                      }
                      className="rounded-2xl bg-violet-500 px-8 py-3 font-medium transition hover:bg-violet-400"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage