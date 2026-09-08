// src/lib/storage.ts
// All state is stored in localStorage — survives page refresh during live demo.
// Only computed scores are stored; raw text is only accessible to the student
// themselves (never surfaced in the parent view).

import { analyzeSentiment } from './sentiment'

export type JournalEntry = {
  id: string
  studentId: string
  text: string
  score: number
  label: 'Positive' | 'Neutral' | 'Distress Signal'
  timestamp: number // Unix ms
}

// ─── Internal helpers ──────────────────────────────────────────────────────

function journalKey(studentId: string) {
  return `sahaj_journal_${studentId}`
}

function consentKey(studentId: string) {
  return `sahaj_consent_${studentId}`
}

function thresholdKey(studentId: string) {
  return `sahaj_threshold_${studentId}`
}

function seededKey(studentId: string) {
  return `sahaj_seeded_${studentId}`
}

// ─── Journal ──────────────────────────────────────────────────────────────

export function getJournalEntries(studentId: string): JournalEntry[] {
  try {
    const raw = localStorage.getItem(journalKey(studentId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveJournalEntries(studentId: string, entries: JournalEntry[]): void {
  localStorage.setItem(journalKey(studentId), JSON.stringify(entries))
}

export function addJournalEntry(
  studentId: string,
  text: string,
): JournalEntry {
  const { score, label } = analyzeSentiment(text)
  const entry: JournalEntry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    studentId,
    text,
    score,
    label,
    timestamp: Date.now(),
  }
  const existing = getJournalEntries(studentId)
  saveJournalEntries(studentId, [...existing, entry])
  return entry
}

// ─── Consent ──────────────────────────────────────────────────────────────

export function getConsent(studentId: string): boolean {
  return localStorage.getItem(consentKey(studentId)) === 'true'
}

export function setConsent(studentId: string, value: boolean): void {
  localStorage.setItem(consentKey(studentId), String(value))
}

// ─── Threshold (set by parent) ────────────────────────────────────────────

export function getThreshold(studentId: string): number {
  const raw = localStorage.getItem(thresholdKey(studentId))
  return raw !== null ? parseFloat(raw) : 0.4
}

export function setThreshold(studentId: string, value: number): void {
  localStorage.setItem(thresholdKey(studentId), String(value))
}

// ─── Seed data ────────────────────────────────────────────────────────────

function makeSeedEntry(
  studentId: string,
  text: string,
  daysAgo: number,
): JournalEntry {
  const { score, label } = analyzeSentiment(text)
  return {
    id: `seed_${studentId}_${daysAgo}`,
    studentId,
    text,
    score,
    label,
    timestamp: Date.now() - daysAgo * 24 * 60 * 60 * 1000,
  }
}

/**
 * seedIfEmpty: Only seeds if we haven't done it before for this student.
 * stu1 (Ananya) → declining distress trend over ~10 days.
 * stu2 (Rohan)  → mostly stable/positive with one mild dip.
 */
export function seedIfEmpty(studentId: string): void {
  if (localStorage.getItem(seededKey(studentId)) === 'true') return
  if (getJournalEntries(studentId).length > 0) {
    localStorage.setItem(seededKey(studentId), 'true')
    return
  }

  let entries: JournalEntry[] = []

  if (studentId === 'stu1') {
    // Declining mood — starts okay, spirals into distress signals
    entries = [
      makeSeedEntry(studentId, 'Aaj class mein badhiya raha, teacher ne meri tarif ki. Khush hoon!', 10),
      makeSeedEntry(studentId, 'Exam ki taiyaari theek chal rahi hai. Thoda stressed hoon but okay hoon.', 9),
      makeSeedEntry(studentId, 'Yaar aaj bahut thaka hua feel ho raha hai. Raat ko nahi soya properly.', 8),
      makeSeedEntry(studentId, 'Maths mein fail ho gaya. Bura lag raha hai. Sab log better hain mujhse.', 7),
      makeSeedEntry(studentId, 'I feel so overwhelmed. There is too much pressure and I am crying alone.', 6),
      makeSeedEntry(studentId, 'Akela feel ho raha hoon. Koi samajhta nahi. Bahut dukhi hoon.', 5),
      makeSeedEntry(studentId, 'Udaas hoon. Pareshan hoon. Tension bahut hai. Rona aa raha hai.', 4),
      makeSeedEntry(studentId, 'I feel hopeless and exhausted. Nothing seems to be working. I am so tired.', 3),
      makeSeedEntry(studentId, 'Bahut bura lag raha hai. Akela hoon. Koi friend nahi hai. Helpless feel ho raha hai.', 2),
      makeSeedEntry(studentId, 'Sad and depressed. Overwhelmed by everything. I cannot do this anymore.', 1),
    ]
  } else if (studentId === 'stu2') {
    // Mostly stable/positive with one mild dip
    entries = [
      makeSeedEntry(studentId, 'Aaj cricket khelee. Mast tha! Zabardast goal score kiya.', 10),
      makeSeedEntry(studentId, 'School mein badhiya raha aaj. Friends ke saath maza aaya.', 9),
      makeSeedEntry(studentId, 'Homework zyada tha but managed kar liya. Accha feel ho raha hai.', 8),
      makeSeedEntry(studentId, 'Bahut khush hoon aaj. Science project mein first aaya!', 7),
      makeSeedEntry(studentId, 'Thoda worried hoon exam se but I am confident. Padh raha hoon.', 6),
      makeSeedEntry(studentId, 'Aaj thoda tired tha. Test mein accha nahi gaya. Sad feel ho raha hai thoda.', 5),
      makeSeedEntry(studentId, 'Khushi mili — teacher ne bolaa mera project great tha!', 4),
      makeSeedEntry(studentId, 'Good day overall. Calm and peaceful.', 3),
      makeSeedEntry(studentId, 'Yaar aaj mast day tha. Maza aaya dosto ke saath.', 2),
      makeSeedEntry(studentId, 'Happy and energetic today. Feeling awesome!', 1),
    ]
  }

  saveJournalEntries(studentId, entries)
  localStorage.setItem(seededKey(studentId), 'true')
}
