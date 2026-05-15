import { createContext, useContext, useMemo, useState } from 'react'
import { googleLoginApi, loginApi, signupApi, type User } from '../lib/api'

type AuthContextValue = {
  isAuthenticated: boolean
  isAdmin: boolean
  adminName: string | null
  user: User | null
  loading: boolean
  updateUser: (updates: Partial<User>) => void
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: (profile?: { name?: string; email?: string }) => Promise<void>
  logout: () => void
  adminLogin: (password: string) => boolean
  adminLogout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const AUTH_KEY = 'prepwise-authenticated'
const TOKEN_KEY = 'prepwise-token'
const USER_KEY = 'prepwise-user'
const ADMIN_KEY = 'prepwise-admin'
const ADMIN_NAME_KEY = 'prepwise-admin-name'

// Admin credentials: read from env (set VITE_ADMIN_CODES as JSON in .env for security)
// Format: VITE_ADMIN_CODES={"code1":"Name1","code2":"Name2"}
function getAdmins(): Record<string, string> {
  try {
    const raw = import.meta.env.VITE_ADMIN_CODES as string | undefined
    if (raw) return JSON.parse(raw) as Record<string, string>
  } catch { /* fallback */ }
  // Fallback for dev — override via env in production
  return {
    '22bcsj43': 'Ankita',
    '22bcsi54': 'Priyanka',
    '22bcti01': 'Ayusha',
    '22bcsi21': 'Laurina',
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem(AUTH_KEY) === 'true'
  )
  const [isAdmin, setIsAdmin] = useState(
    () => window.localStorage.getItem(ADMIN_KEY) === 'true'
  )
  const [adminName, setAdminName] = useState<string | null>(
    () => window.localStorage.getItem(ADMIN_NAME_KEY)
  )
  const [user, setUser] = useState<User | null>(() => {
    const stored = window.localStorage.getItem(USER_KEY)
    return stored ? (JSON.parse(stored) as User) : null
  })
  const [loading, setLoading] = useState(false)

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      window.localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isAdmin,
      adminName,
      user,
      loading,
      updateUser,
      login: async (email, password) => {
        setLoading(true)
        try {
          const data = await loginApi(email, password)
          window.localStorage.setItem(TOKEN_KEY, data.token)
          window.localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          window.localStorage.setItem(AUTH_KEY, 'true')
          setUser(data.user)
          setIsAuthenticated(true)
        } finally {
          setLoading(false)
        }
      },
      signup: async (name, email, password) => {
        setLoading(true)
        try {
          const data = await signupApi(name, email, password)
          window.localStorage.setItem(TOKEN_KEY, data.token)
          window.localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          window.localStorage.setItem(AUTH_KEY, 'true')
          setUser(data.user)
          setIsAuthenticated(true)
        } finally {
          setLoading(false)
        }
      },
      loginWithGoogle: async (profile) => {
        setLoading(true)
        try {
          const data = await googleLoginApi(profile)
          window.localStorage.setItem(TOKEN_KEY, data.token)
          window.localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          window.localStorage.setItem(AUTH_KEY, 'true')
          setUser(data.user)
          setIsAuthenticated(true)
        } finally {
          setLoading(false)
        }
      },
      logout: () => {
        window.localStorage.removeItem(AUTH_KEY)
        window.localStorage.removeItem(TOKEN_KEY)
        window.localStorage.removeItem(USER_KEY)
        window.localStorage.removeItem(ADMIN_KEY)
        window.localStorage.removeItem(ADMIN_NAME_KEY)
        setUser(null)
        setIsAuthenticated(false)
        setIsAdmin(false)
        setAdminName(null)
      },
      adminLogin: (password) => {
        const admins = getAdmins()
        const name = admins[password]
        if (name) {
          window.localStorage.setItem(AUTH_KEY, 'true')
          window.localStorage.setItem(TOKEN_KEY, 'prepwise-token-admin')
          window.localStorage.setItem(ADMIN_KEY, 'true')
          window.localStorage.setItem(ADMIN_NAME_KEY, name)
          setIsAuthenticated(true)
          setIsAdmin(true)
          setAdminName(name)
          return true
        }
        return false
      },
      adminLogout: () => {
        window.localStorage.removeItem(ADMIN_KEY)
        window.localStorage.removeItem(ADMIN_NAME_KEY)
        window.localStorage.removeItem(AUTH_KEY)
        window.localStorage.removeItem(TOKEN_KEY)
        window.localStorage.removeItem(USER_KEY)
        setIsAdmin(false)
        setAdminName(null)
        setIsAuthenticated(false)
        setUser(null)
      },
    }),
    [isAuthenticated, isAdmin, adminName, loading, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
