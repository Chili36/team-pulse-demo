import {
  MOODS_TABLE,
  MOOD_COLUMNS,
  insertMood,
  listMoodEvents,
  supabase,
} from './supabaseClient.js'
import { VIBE_VALUES } from './constants.js'

export const SESSION_STORAGE_KEY = 'team-pulse-session-id'
export const MOOD_PAGE_SIZE = 1000

export function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getOrCreateSessionId(storage = globalThis.sessionStorage) {
  const existingSessionId = storage?.getItem?.(SESSION_STORAGE_KEY)
  if (existingSessionId) {
    return existingSessionId
  }

  const sessionId = createSessionId()
  storage?.setItem?.(SESSION_STORAGE_KEY, sessionId)
  return sessionId
}

export function buildMoodSnapshot(events) {
  const counts = Object.fromEntries(VIBE_VALUES.map((vibe) => [vibe, 0]))
  const orderedEvents = [...events].sort(
    (left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
  )

  for (const event of orderedEvents) {
    if (Object.hasOwn(counts, event.vibe)) {
      counts[event.vibe] += 1
    }
  }

  return {
    chartData: VIBE_VALUES.map((vibe) => ({
      vibe,
      count: counts[vibe],
    })),
    events: orderedEvents,
    latestEvent: orderedEvents.at(-1) ?? null,
    totalCount: orderedEvents.length,
  }
}

export async function listAllMoodEvents(pageSize = MOOD_PAGE_SIZE) {
  const firstPage = await listMoodEvents(pageSize)

  if (firstPage.length < pageSize) {
    return firstPage
  }

  const allEvents = [...firstPage]
  let from = firstPage.length

  while (true) {
    const { data, error } = await supabase
      .from(MOODS_TABLE)
      .select(MOOD_COLUMNS)
      .order('created_at', { ascending: true })
      .range(from, from + pageSize - 1)

    if (error) {
      throw error
    }

    const page = data ?? []
    if (page.length === 0) {
      break
    }

    allEvents.push(...page)

    if (page.length < pageSize) {
      break
    }

    from += page.length
  }

  return allEvents
}

export async function loadMoodSnapshot(pageSize = MOOD_PAGE_SIZE) {
  const events = await listAllMoodEvents(pageSize)
  return buildMoodSnapshot(events)
}

export async function submitMoodSelection(vibe, options = {}) {
  if (!VIBE_VALUES.includes(vibe)) {
    throw new Error(`Unsupported vibe: ${vibe}`)
  }

  const sessionId = options.sessionId ?? getOrCreateSessionId(options.storage)
  const inserted = await insertMood({ vibe, sessionId })
  const snapshot = await loadMoodSnapshot(options.pageSize)

  return {
    inserted,
    sessionId,
    snapshot,
  }
}
