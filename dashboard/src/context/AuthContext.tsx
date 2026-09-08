// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { getUserByCredentials, getUserById, type User } from '../lib/auth'

type LoginResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
  user: User | null
  login: (username: string, password: string) => LoginResult
  logout: () => void
}

const SESSION_KEY = 'sahaj_session_user_id'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Rehydrate from localStorage on mount
    const savedId = localStorage.getItem(SESSION_KEY)
    if (!savedId) return null
    return getUserById(savedId) ?? null
  })

  // Keep localStorage in sync whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, user.id)
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }, [user])

  function login(username: string, password: string): LoginResult {
    if (!username.trim() || !password.trim()) {
      return { ok: false, error: 'Username and password are required.' }
    }
    const found = getUserByCredentials(username.trim(), password)
    if (!found) {
      return { ok: false, error: 'Invalid username or password.' }
    }
    setUser(found)
    return { ok: true }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
