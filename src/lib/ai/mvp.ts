export interface SuggestionInput {
  title: string
  description: string
  category?: string
}

const STOP = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'your', 'have', 'you', 'into', 'about'])

export function suggestListingCopy(input: SuggestionInput) {
  const title = input.title.trim()
  const description = input.description.trim()

  const altTitle = title
    ? `${title}${input.category ? ` — ${input.category}` : ''}`
    : input.category ? `${input.category} item in good condition` : 'Well-kept item ready to trade'

  const bullets = [
    'What condition is it in?',
    'What is included in the swap?',
    'Any defects or notes to mention up front?',
  ]

  const strongerDesc = description || `Clean, well-kept listing. ${bullets.join(' ')}`
  return { altTitle, strongerDesc }
}

export function suggestServiceCopy(input: SuggestionInput) {
  const title = input.title.trim() || 'Service offering'
  const strongerDesc = input.description.trim() || 'Clear scope, timeline, and deliverables. Includes revision policy and handoff details.'

  return {
    altTitle: `${title} (${input.category ?? 'Professional service'})`,
    strongerDesc,
  }
}

export function inferTasteTagsFromText(posts: string[]): string[] {
  const freq = new Map<string, number>()
  for (const post of posts) {
    const words = post.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
    for (const w of words) {
      if (w.length < 4 || STOP.has(w)) continue
      freq.set(w, (freq.get(w) ?? 0) + 1)
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w)
}
