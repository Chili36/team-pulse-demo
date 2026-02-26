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

    setMoods(data || [])
    setLoading(false)
  }, [])

  const submitMood = useCallback(async (vibe) => {
    const { error } = await supabase
      .from('moods')
      .insert({ vibe, session_id: sessionId })

    if (error) {
      console.error('Error submitting mood:', error)
      return
    }

    await fetchMoods()
  }, [fetchMoods])

  useEffect(() => {
    fetchMoods()

    const interval = setInterval(fetchMoods, 5000)
    return () => clearInterval(interval)
  }, [fetchMoods])

  return { moods, submitMood, loading }
}
