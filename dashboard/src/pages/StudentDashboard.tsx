// src/pages/StudentDashboard.tsx
import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { LogOut, Shield, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { StudentUser } from '../lib/auth'
import {
  seedIfEmpty,
  getJournalEntries,
  addJournalEntry,
  getConsent,
  setConsent,
  type JournalEntry,
} from '../lib/storage'

function labelColor(label: JournalEntry['label']) {
  if (label === 'Positive') return 'bg-green-100 text-green-700 border-green-200'
  if (label === 'Distress Signal') return 'bg-red-100 text-red-700 border-red-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

function scoreColor(score: number) {
  if (score >= 0.6) return 'text-green-600'
  if (score < 0.4) return 'text-red-600'
  return 'text-slate-500'
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const student = user as StudentUser

  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [text, setText] = useState('')
  const [lastResult, setLastResult] = useState<JournalEntry | null>(null)
  const [consent, setConsentState] = useState(false)

  const refresh = useCallback(() => {
    const e = getJournalEntries(student.id)
    setEntries([...e].sort((a, b) => a.timestamp - b.timestamp))
    setConsentState(getConsent(student.id))
  }, [student.id])

  useEffect(() => {
    seedIfEmpty(student.id)
    refresh()
  }, [refresh, student.id])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    const entry = addJournalEntry(student.id, text.trim())
    setLastResult(entry)
    setText('')
    refresh()
  }

  function handleConsentToggle() {
    const next = !consent
    setConsent(student.id, next)
    setConsentState(next)
  }

  const chartData = entries.map((e) => ({
    date: new Date(e.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    score: parseFloat(e.score.toFixed(3)),
  }))

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">{student.name}</p>
              <p className="text-[11px] text-slate-400">{student.grade} · Student</p>
            </div>
          </div>
          <button
            id="student-logout"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Daily Check-in */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Daily Check-in</h2>
          <p className="text-xs text-slate-400 mb-4">
            Your entry is analysed on-device — the raw text never leaves your browser.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              id="journal-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Aaj kaisa mehsoos ho raha hai? / How are you feeling today?"
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-300"
            />
            <button
              id="journal-submit"
              type="submit"
              disabled={!text.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              Analyse &amp; Save
            </button>
          </form>

          {/* Immediate result */}
          {lastResult && (
            <div className={`mt-4 rounded-xl border px-4 py-3 flex items-start gap-3 ${labelColor(lastResult.label)}`}>
              <div>
                <p className="text-xs font-bold">{lastResult.label}</p>
                <p className="text-xs mt-0.5">
                  Sentiment score:{' '}
                  <span className="font-mono font-bold">{lastResult.score.toFixed(3)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mood trend chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Your Mood Trend</h2>
          <p className="text-xs text-slate-400 mb-4">
            Your personal wellbeing score over time. Below the red line may indicate distress.
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  domain={[0, 1]}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
                    formatter={(v) => [typeof v === 'number' ? v.toFixed(3) : String(v), 'Score']}
                />
                <ReferenceLine
                  y={0.4}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Distress Threshold', position: 'right', fill: '#ef4444', fontSize: 11, fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#2563eb' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Privacy consent card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Parent Sharing</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                <strong>Share my wellbeing trend with my parent.</strong>
                <br />
                Only your aggregated mood score trend is shared if enabled. Your parent{' '}
                <em>never</em> sees your journal text.
              </p>
            </div>
            {/* Toggle switch */}
            <button
              id="consent-toggle"
              role="switch"
              aria-checked={consent}
              onClick={handleConsentToggle}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 transition-colors duration-200 cursor-pointer ${
                consent ? 'bg-blue-600 border-blue-600' : 'bg-slate-200 border-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                  consent ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <p className={`mt-3 text-xs font-medium ${consent ? 'text-green-600' : 'text-slate-400'}`}>
            {consent ? '✓ Sharing enabled — your parent can see your mood trend.' : 'Sharing disabled — your data is private.'}
          </p>
        </div>

        {/* Past entries list */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Past Entries</h2>
          {entries.length === 0 ? (
            <p className="text-sm text-slate-400">No entries yet. Write your first check-in above.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {[...entries].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${labelColor(entry.label)}`}>
                      {entry.label}
                    </span>
                    <span className={`text-xs font-mono font-bold ${scoreColor(entry.score)}`}>
                      {entry.score.toFixed(3)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{entry.text}</p>
                  <p className="text-[11px] text-slate-400 mt-2">{formatDate(entry.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
