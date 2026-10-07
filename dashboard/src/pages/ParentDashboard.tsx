// src/pages/ParentDashboard.tsx
import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { LogOut, Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { ParentUser } from '../lib/auth'
import { getStudentById } from '../lib/auth'
import {
  getJournalEntries,
  getConsent,
  getThreshold,
  setThreshold,
  type JournalEntry,
} from '../lib/storage'

function labelColor(label: JournalEntry['label']) {
  if (label === 'Positive') return 'bg-green-100 text-green-700 border-green-200'
  if (label === 'Distress Signal') return 'bg-red-100 text-red-700 border-red-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function ParentDashboard() {
  const { user, logout } = useAuth()
  const parent = user as ParentUser

  const child = getStudentById(parent.childId)

  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [hasConsent, setHasConsent] = useState(false)
  const [threshold, setThresholdState] = useState(0.4)

  const refresh = useCallback(() => {
    if (!child) return
    const e = getJournalEntries(child.id)
    setEntries([...e].sort((a, b) => a.timestamp - b.timestamp))
    setHasConsent(getConsent(child.id))
    setThresholdState(getThreshold(child.id))
  }, [child])

  // Poll for consent changes every 3 seconds (student may toggle in another tab)
  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 3000)
    return () => clearInterval(interval)
  }, [refresh])

  function handleThresholdChange(val: number) {
    if (!child) return
    setThreshold(child.id, val)
    setThresholdState(val)
  }

  const chartData = entries.map((e) => ({
    date: formatDate(e.timestamp),
    score: parseFloat(e.score.toFixed(3)),
    label: e.label,
  }))

  const latest = entries[entries.length - 1] ?? null
  const last3avg =
    entries.length >= 1
      ? entries.slice(-3).reduce((sum, e) => sum + e.score, 0) /
        Math.min(entries.length, 3)
      : null
  const isAlert = last3avg !== null && last3avg < threshold

  if (!child) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <p className="text-slate-400 text-sm">Child account not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">{parent.name}</p>
              <p className="text-[11px] text-slate-400">Parent · Monitoring {child.name}</p>
            </div>
          </div>
          <button
            id="parent-logout"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Consent gate */}
        {!hasConsent ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Waiting for {child.name}'s consent
              </h2>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                {child.name} has not yet enabled parent sharing. SAHAJ is opt-in by design —
                data is only shared when the student explicitly allows it. No data is visible
                here until consent is granted.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700 max-w-sm">
              <strong>Privacy by design:</strong> Ask {child.name} to log in and turn on the
              "Share my wellbeing trend with my parent" toggle in their dashboard.
            </div>
          </div>
        ) : (
          <>
            {/* Alert / status banner */}
            {isAlert ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-800">
                    Distress pattern detected — consider checking in with {child.name}.
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Average of last 3 entries:{' '}
                    <span className="font-mono font-bold">{last3avg!.toFixed(3)}</span>{' '}
                    is below your alert threshold of{' '}
                    <span className="font-mono font-bold">{threshold.toFixed(2)}</span>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-800">
                    All good — {child.name}'s recent mood trend is within normal range.
                  </p>
                  {last3avg !== null && (
                    <p className="text-xs text-green-600 mt-0.5">
                      Average of last 3 entries:{' '}
                      <span className="font-mono font-bold">{last3avg.toFixed(3)}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Latest status card */}
            {latest && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-5">
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${labelColor(latest.label)}`}>
                  {latest.label}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Latest wellbeing score</p>
                  <p className="text-2xl font-bold text-slate-900 font-mono leading-none mt-0.5">
                    {latest.score.toFixed(3)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{formatDate(latest.timestamp)}</p>
                </div>
              </div>
            )}

            {/* Trend chart */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-base font-bold text-slate-900">Mood Trend</h2>
                <span className="text-[11px] text-slate-400 italic">
                  Scores only · Raw journal text is never shown here
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                For privacy, only aggregated scores are visible here — never raw journal entries.
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis
                      domain={[0, 1]}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => v.toFixed(1)}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
                        formatter={(v) => [typeof v === 'number' ? v.toFixed(3) : String(v), 'Wellbeing Score']}
                    />
                    <ReferenceLine
                      y={threshold}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      label={{ value: `Threshold (${threshold.toFixed(2)})`, position: 'insideBottomRight', fill: '#ef4444', fontSize: 10, fontWeight: 600 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#7c3aed' }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alert threshold control */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">Alert Threshold</h2>
              <p className="text-xs text-slate-500 mb-4">
                If {child.name}'s average wellbeing score drops below this value for 3+ entries,
                you'll see a distress alert above. Lower = more sensitive.
              </p>
              <div className="flex items-center gap-4">
                <input
                  id="threshold-slider"
                  type="range"
                  min={0.2}
                  max={0.6}
                  step={0.01}
                  value={threshold}
                  onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
                  className="flex-1 accent-violet-600"
                />
                <input
                  id="threshold-number"
                  type="number"
                  min={0.2}
                  max={0.6}
                  step={0.01}
                  value={threshold}
                  onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
                  className="w-20 px-2 py-1.5 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 px-0.5">
                <span>0.20 (more sensitive)</span>
                <span>0.60 (less sensitive)</span>
              </div>
            </div>

            {/* Score list — NO raw text shown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">Entry Log</h2>
              <p className="text-xs text-slate-400 mb-4 italic">
                Dates, scores, and labels only. Raw journal text is never visible to parents.
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {[...entries].reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${labelColor(entry.label)}`}>
                        {entry.label}
                      </span>
                      <span className="text-xs text-slate-500">{formatDate(entry.timestamp)}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {entry.score.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
