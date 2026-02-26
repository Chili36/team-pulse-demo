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
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching moods:', error)
      return
    }

    const rows = data || []
    setMoods(rows)
    setLoading(false)

    const myVote = rows.find((m) => m.session_id === sessionId)
    if (myVote) {
      setHasVoted(true)
      setMyVibe(myVote.vibe)
    }
  }, [])

  const submitMood = useCallback(async (vibe) => {
    if (hasVoted) return

    setLoading(true)
    const { error } = await supabase
      .from('moods')
      .insert({ vibe, session_id: sessionId })

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

    const interval = setInterval(fetchMoods, 5000)
    return () => clearInterval(interval)
  }, [fetchMoods])

  return { moods, submitMood, loading, hasVoted, myVibe }
}
