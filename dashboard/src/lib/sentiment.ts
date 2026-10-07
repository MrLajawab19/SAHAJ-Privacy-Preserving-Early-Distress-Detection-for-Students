// src/lib/sentiment.ts
//
// On-device sentiment scoring: raw journal text never leaves the browser /
// is never transmitted to any server. This is consistent with the project's
// federated-learning / privacy-first design — only the computed score is
// potentially shared, never the raw text.

export type SentimentResult = {
  score: number
  label: 'Positive' | 'Neutral' | 'Distress Signal'
  matchedWords: string[]
}

// Lexicon of English + Hinglish words with polarity weights (-2.5 to +2.5)
// Positive words represent good mood; negative words represent distress signals.
const LEXICON: Record<string, number> = {
  // --- English positive ---
  good: 1.5,
  great: 2.0,
  happy: 2.0,
  awesome: 2.5,
  excited: 2.0,
  proud: 2.0,
  confident: 1.8,
  calm: 1.5,
  joy: 2.0,
  glad: 1.5,
  love: 2.0,
  wonderful: 2.5,
  fantastic: 2.5,
  cheerful: 2.0,
  peaceful: 1.5,
  motivated: 1.8,
  energetic: 1.8,
  hopeful: 1.5,
  blessed: 2.0,
  grateful: 1.8,

  // --- Hinglish positive ---
  achha: 1.5,
  accha: 1.5,
  badhiya: 2.0,
  mast: 2.0,
  khush: 2.0,
  sahi: 1.5,
  majaa: 2.0,
  maza: 2.0,
  zabardast: 2.5,
  shaandar: 2.5,
  jhakaas: 2.5,
  acha: 1.5,
  badiya: 2.0,
  khushi: 2.0,
  maze: 1.5,
  sundar: 1.8,
  pyaar: 1.8,
  umeed: 1.5,

  // --- English negative ---
  sad: -2.0,
  tired: -1.5,
  stressed: -2.0,
  anxious: -2.0,
  worried: -1.8,
  lonely: -2.0,
  hopeless: -2.5,
  depressed: -2.5,
  scared: -2.0,
  fail: -1.8,
  failed: -1.8,
  exhausted: -2.0,
  overwhelmed: -2.0,
  cry: -2.0,
  crying: -2.0,
  alone: -1.8,
  horrible: -2.5,
  terrible: -2.5,
  miserable: -2.5,
  helpless: -2.5,
  numb: -2.0,
  empty: -1.8,
  broken: -2.2,
  worthless: -2.5,
  lost: -1.5,
  awful: -2.5,
  pain: -2.0,
  hurt: -2.0,
  hate: -2.0,

  // --- Hinglish negative ---
  udaas: -2.0,
  pareshan: -2.0,
  tension: -1.8,
  dukhi: -2.0,
  bura: -1.8,
  akela: -2.0,
  rona: -2.0,
  dar: -1.8,
  ghabrahat: -2.0,
  gussa: -1.8,
  nirasha: -2.0,
  takleef: -2.0,
  mushkil: -1.5,
  pareshaan: -2.0,
  thaka: -1.5,
  thakaan: -1.5,
  nahi: -0.5,
  bekar: -1.8,
  bura_lag: -2.0,
}

// Smooth squashing function: approaches 0/1 asymptotically so scores for
// distinct very-negative entries never collapse to the same value.
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

export function analyzeSentiment(text: string): SentimentResult {
  // On-device scoring: raw journal text never leaves the browser / is never
  // transmitted — consistent with the project's privacy-preserving design.
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)

  let total = 0
  const matchedWords: string[] = []

  for (const token of tokens) {
    if (LEXICON[token] !== undefined) {
      total += LEXICON[token]
      matchedWords.push(token)
    }
  }

  // Divide by 3 so the sigmoid stays sensitive across a realistic range:
  //   neutral text (total ≈ 0)   → score ≈ 0.500
  //   mildly negative (≈ -3)     → score ≈ 0.269
  //   strongly negative (≈ -6)   → score ≈ 0.119
  //   very strongly negative (≈ -9) → score ≈ 0.053
  // This preserves relative ordering between different distress entries
  // instead of clamping them all to 0.000.
  const score = Math.round(sigmoid(total / 3) * 1000) / 1000

  let label: SentimentResult['label']
  if (score >= 0.6) {
    label = 'Positive'
  } else if (score < 0.4) {
    label = 'Distress Signal'
  } else {
    label = 'Neutral'
  }

  return { score, label, matchedWords }
}
