import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'

import { useAuth } from '../context/AuthContext'

import PageWrapper from '../layout/PageWrapper'

type AuthMode = 'login' | 'signup' | 'forgot'

interface AuthPageProps {
  initialMode?: 'login' | 'signup'
}

function AuthPage({
  initialMode = 'login',
}: AuthPageProps) {
  const [mode, setMode] =
    useState<AuthMode>(initialMode)

  const [name, setName] = useState('')

  const [email, setEmail] = useState('')

  const [password, setPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [message, setMessage] =
    useState('')

  const navigate = useNavigate()

  const {
    login,
    signup,
    loading,
  } = useAuth()

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const onSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setMessage('')

    if (!email.trim()) {
      setMessage('Email is required.')
      return
    }

    if (
      mode !== 'forgot' &&
      !password.trim()
    ) {
      setMessage('Password is required.')
      return
    }

    if (
      mode === 'signup' &&
      !name.trim()
    ) {
      setMessage('Full name is required.')
      return
    }

    if (
      mode === 'signup' &&
      password !== confirmPassword
    ) {
      setMessage(
        'Passwords do not match.'
      )

      return
    }

    if (mode === 'forgot') {
      setMessage(
        'Password reset is not available yet.'
      )

      return
    }

    try {
      if (mode === 'signup') {
        await signup(
          name,
          email,
          password
        )
      } else {
        await login(
          email,
          password
        )
      }

      navigate('/dashboard')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Authentication failed'
      )
    }
  }

  return (
    <PageWrapper innerClassName="items-center justify-center px-4 py-8 md:px-8">
      <GlassCard className="w-full max-w-[500px] p-10">
        <form
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <div className="space-y-2 text-center">
            <p className="text-3xl font-bold tracking-tight text-[#C7B8FF]">
              PrepWise
            </p>

            <h2 className="text-lg font-medium text-white/60">
              {mode === 'login'
                ? 'Welcome Back'
                : mode === 'signup'
                  ? 'Create Account'
                  : 'Reset Password'}
            </h2>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  navigate('/login')
                }}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  mode === 'login'
                    ? 'bg-[#C7B8FF] text-[#0B1020]'
                    : 'text-gray-300'
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  navigate('/signup')
                }}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  mode === 'signup'
                    ? 'bg-[#C7B8FF] text-[#0B1020]'
                    : 'text-gray-300'
                }`}
              >
                Signup
              </button>
            </div>
          </div>

          {mode === 'signup' ? (
            <label className="block space-y-2">
              <span className="ml-4 text-sm font-medium text-white/50">
                Full name
              </span>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your full name"
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#C7B8FF]/50 focus:bg-white/10"
              />
            </label>
          ) : null}

          <label className="block space-y-2">
            <span className="ml-4 text-sm font-medium text-white/50">
              Email address
            </span>

            <input
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              type="email"
              className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#C7B8FF]/50 focus:bg-white/10"
            />
          </label>

          {mode !== 'forgot' ? (
            <label className="block space-y-2">
              <span className="ml-4 text-sm font-medium text-white/50">
                Password
              </span>

              <input
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                type="password"
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#C7B8FF]/50 focus:bg-white/10"
              />
            </label>
          ) : null}

          {mode === 'signup' ? (
            <label className="block space-y-2">
              <span className="ml-4 text-sm font-medium text-white/50">
                Confirm password
              </span>

              <input
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Repeat your password"
                type="password"
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#C7B8FF]/50 focus:bg-white/10"
              />
            </label>
          ) : null}

          {mode === 'forgot' ? (
            <p className="text-sm text-gray-300">
              Password reset support will
              be added later.
            </p>
          ) : (
            <button
              type="button"
              className="text-sm text-[#C7B8FF]"
              onClick={() =>
                setMode('forgot')
              }
            >
              Forgot Password?
            </button>
          )}

          <PrimaryButton type="submit">
            {loading
              ? 'Please wait...'
              : mode === 'signup'
                ? 'Create account'
                : mode === 'forgot'
                  ? 'Send reset link'
                  : 'Sign in'}
          </PrimaryButton>

          {message ? (
            <p className="text-center text-sm text-gray-300">
              {message}
            </p>
          ) : null}

          <div className="space-y-3">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-gray-500">
              Social Login
            </p>

            <PrimaryButton
              type="button"
              variant="secondary"
              disabled
            >
              Google Login Coming Soon
            </PrimaryButton>
          </div>

          {mode === 'forgot' ? (
            <button
              type="button"
              className="mx-auto block text-sm text-gray-300"
              onClick={() =>
                setMode('login')
              }
            >
              Back to Login
            </button>
          ) : null}
        </form>
      </GlassCard>
    </PageWrapper>
  )
}

export default AuthPage