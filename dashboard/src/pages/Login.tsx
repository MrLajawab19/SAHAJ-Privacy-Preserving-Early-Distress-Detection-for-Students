// src/pages/Login.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Eye, EyeOff, Info } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { role: 'student', username: 'ananya', password: 'demo123', label: 'Ananya Sharma (Student, Class 11)' },
  { role: 'student', username: 'rohan', password: 'demo123', label: 'Rohan Verma (Student, Class 9)' },
  { role: 'parent', username: 'sharma.parent', password: 'demo123', label: 'Sunita Sharma (Parent of Ananya)' },
  { role: 'parent', username: 'verma.parent', password: 'demo123', label: 'Vikas Verma (Parent of Rohan)' },
]

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [activeTab, setActiveTab] = useState<'student' | 'parent'>('student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Read ?role= from URL to preselect tab
  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'parent') setActiveTab('parent')
    else setActiveTab('student')
  }, [searchParams])

  // Already logged in → redirect to correct dashboard
  useEffect(() => {
    if (user) {
      navigate(user.role === 'student' ? '/student' : '/parent', { replace: true })
    }
  }, [user, navigate])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = login(username, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
    }
    // Navigation is handled by the useEffect above once `user` updates
  }

  function fillDemo(u: string, p: string) {
    setUsername(u)
    setPassword(p)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </span>
        <span className="text-lg font-bold tracking-tight text-slate-900">SAHAJ</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200">
            {(['student', 'parent'] as const).map((tab) => (
              <button
                key={tab}
                id={`login-tab-${tab}`}
                onClick={() => { setActiveTab(tab); setError(null) }}
                className={`py-3.5 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'student' ? '🎓 Student' : '👨‍👩‍👧 Parent'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="login-username" className="block text-xs font-semibold text-slate-600 mb-1.5">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === 'student' ? 'e.g. ananya' : 'e.g. sharma.parent'}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-2 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
        </div>

        {/* Demo credentials helper box */}
        <div className="mt-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-3">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            Demo Accounts (click to fill)
          </div>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.filter((a) => a.role === activeTab).map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => fillDemo(acc.username, acc.password)}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-colors"
              >
                <div className="text-xs font-medium text-slate-700">{acc.label}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {acc.username} · {acc.password}
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          <Link to="/" className="hover:text-blue-600 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
