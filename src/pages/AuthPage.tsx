import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import PageWrapper from '../layout/PageWrapper'
import { useAuth } from '../context/AuthContext'

type AuthMode = 'login' | 'signup' | 'forgot'

interface AuthPageProps {
  initialMode?: 'login' | 'signup'
}

function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('ankitadash4656@gmail.com')
  const [password, setPassword] = useState('22bcsj43')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [googleReady, setGoogleReady] = useState(false)
  const navigate = useNavigate()
  const { login, signup, loginWithGoogle, loading } = useAuth()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    const src = 'https://accounts.google.com/gsi/client'
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null
    if (existing) {
      setGoogleReady(true)
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true
    script.onload = () => setGoogleReady(true)
    document.head.appendChild(script)
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    if (mode === 'forgot') {
      setMessage('Reset link sent to your email (mock).')
      return
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    const run = async () => {
      try {
        if (mode === 'signup') {
          await signup(name || 'PrepWise User', email, password)
        } else {
          await login(email, password)
        }
        navigate('/dashboard')
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Auth failed')
      }
    }
    void run()
  }

  const onGoogleLogin = async () => {
    setMessage('')
    try {
      if (!googleClientId) {
        setMessage('Google OAuth is not configured. Add VITE_GOOGLE_CLIENT_ID in .env.')
        return
      }
      if (!googleReady || !window.google?.accounts?.oauth2) {
        setMessage('Google SDK is loading. Try again in a second.')
        return
      }

      const tokenResponse = await new Promise<{ access_token?: string; error?: string }>((resolve) => {
        const client = window.google!.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'openid email profile',
          callback: (response) => resolve(response),
        })
        client.requestAccessToken({ prompt: 'select_account' })
      })

      if (!tokenResponse.access_token) {
        throw new Error(tokenResponse.error || 'Google login failed')
      }

      const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      })
      if (!profileRes.ok) {
        throw new Error('Failed to read Google profile')
      }
      const profile = (await profileRes.json()) as { name?: string; email?: string }
      await loginWithGoogle({ name: profile.name, email: profile.email })
      navigate('/dashboard')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Google login failed')
    }
  }

  return (
    <PageWrapper innerClassName="items-center justify-center px-4 py-8 md:px-8">
      <GlassCard className="w-full max-w-[500px] p-10">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-3xl font-bold tracking-tight text-[#C7B8FF]">PrepWise</p>
            <h2 className="text-lg font-medium text-white/60">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
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
                className={`rounded-full px-3 py-2 text-sm transition ${mode === 'login' ? 'bg-[#C7B8FF] text-[#0B1020]' : 'text-gray-300'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  navigate('/signup')
                }}
                className={`rounded-full px-3 py-2 text-sm transition ${mode === 'signup' ? 'bg-[#C7B8FF] text-[#0B1020]' : 'text-gray-300'}`}
              >
                Signup
              </button>
            </div>
          </div>

          {mode === 'signup' ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-white/50 ml-4">Full name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#C7B8FF]/50 focus:bg-white/10"
              />
            </label>
          ) : null}
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white/50 ml-4">Email address</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              type="email"
              className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#C7B8FF]/50 focus:bg-white/10"
            />
          </label>
          {mode !== 'forgot' ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-white/50 ml-4">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                type="password"
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#C7B8FF]/50 focus:bg-white/10"
              />
            </label>
          ) : null}
          {mode === 'signup' ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-white/50 ml-4">Confirm password</span>
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                type="password"
                className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all duration-300 focus:border-[#C7B8FF]/50 focus:bg-white/10"
              />
            </label>
          ) : null}

          {mode === 'forgot' ? (
            <p className="text-sm text-gray-300">
              Enter your email and we will send a reset link.
            </p>
          ) : (
            <button
              type="button"
              className="text-sm text-[#C7B8FF]"
              onClick={() => setMode('forgot')}
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
          {message ? <p className="text-sm text-center text-gray-300">{message}</p> : null}

          <div className="space-y-3">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-gray-500">OR Social Login</p>
            <PrimaryButton type="button" variant="secondary" onClick={onGoogleLogin} disabled={loading}>
              {loading ? 'Please wait...' : 'Continue with Google'}
            </PrimaryButton>
          </div>

          {mode === 'forgot' ? (
            <button type="button" className="mx-auto block text-sm text-gray-300" onClick={() => setMode('login')}>
              Back to Login
            </button>
          ) : null}
        </form>
      </GlassCard>
    </PageWrapper>
  )
}

export default AuthPage
