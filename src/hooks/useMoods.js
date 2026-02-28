import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

function getSessionId() {
  let sessionId = sessionStorage.getItem('pulse_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('pulse_session_id', sessionId)
  }
  return sessionId
}

const sessionId = getSessionId()

export function useMoods() {
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasVoted, setHasVoted] = useState(false)
  const [myVibe, setMyVibe] = useState(null)

  const fetchMoods = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)

      if (error) {
        console.error('Error fetching moods:', error)
        setLoading(false)
        return
      }

      // Deduplicate: keep only the latest vote per session
      const seen = new Set()
      const unique = (data || []).filter((m) => {
        if (seen.has(m.session_id)) return false
        seen.add(m.session_id)
        return true
      })

      setMoods(unique)
      setLoading(false)
    } catch (err) {
      console.error('Fetch failed:', err)
      setLoading(false)
    }
  }, [])

  const checkExistingVote = useCallback(async () => {
    const { data } = await supabase
      .from('moods')
      .select('vibe')
      .eq('session_id', sessionId)
      .limit(1)

    if (data && data.length > 0) {
      setHasVoted(true)
      setMyVibe(data[0].vibe)
    }
  }, [])

  const submitMood = useCallback(async (vibe, comment) => {
    if (hasVoted) return

    setLoading(true)
    const row = { vibe, session_id: sessionId }
    if (comment) row.comment = comment

    let { error } = await supabase
      .from('moods')
      .insert(row)

    // If the insert failed due to a missing 'comment' column (older schema),
    // retry without the comment field so the vote is still recorded.
    if (error && comment) {
      const fallbackRow = { vibe, session_id: sessionId }
      const result = await supabase.from('moods').insert(fallbackRow)
      error = result.error
    }

    if (error) {
      console.error('Error submitting mood:', error)
      setLoading(false)
      return
    }

    setHasVoted(true)
    setMyVibe(vibe)
    await fetchMoods()
  }, [fetchMoods, hasVoted])

  useEffect(() => {
    fetchMoods()
    checkExistingVote()

    const interval = setInterval(fetchMoods, 5000)
    return () => clearInterval(interval)
  }, [fetchMoods, checkExistingVote])

  return { moods, submitMood, loading, hasVoted, myVibe }
}
