import { useEffect, useRef, useState } from 'react'
import { VIBE_VALUES, VIBE_OPTIONS, COPY } from './constants.js'
import { TeamPulseView } from './components/TeamPulseView.jsx'
import { loadMoodSnapshot, submitMoodSelection } from './teamPulseModel.js'

const EMPTY_SNAPSHOT = {
  chartData: VIBE_VALUES.map((vibe) => ({ vibe, count: 0 })),
  events: [],
  latestEvent: null,
  totalCount: 0,
}

function getErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return `${COPY.submitError} ${error.message}`
  }

  return COPY.submitError
}

export default function App() {
  const [snapshot, setSnapshot] = useState(EMPTY_SNAPSHOT)
  const [isLoading, setIsLoading] = useState(true)
  const [submittingVibe, setSubmittingVibe] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (hasLoadedRef.current) {
      return undefined
    }

    hasLoadedRef.current = true
    let cancelled = false

    async function hydrate() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const nextSnapshot = await loadMoodSnapshot()
        if (!cancelled) {
          setSnapshot(nextSnapshot)
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void hydrate()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleVibeTap(vibe) {
    setSubmittingVibe(vibe)
    setErrorMessage('')

    try {
      const { inserted, snapshot: nextSnapshot } = await submitMoodSelection(vibe)
      setSnapshot({
        ...nextSnapshot,
        latestEvent: inserted,
      })
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmittingVibe('')
    }
  }

  return (
    <TeamPulseView
      copy={COPY}
      vibeOptions={VIBE_OPTIONS}
      chartData={snapshot.chartData}
      totalCount={snapshot.totalCount}
      latestEvent={snapshot.latestEvent}
      isLoading={isLoading}
      isSubmitting={Boolean(submittingVibe)}
      submittingVibe={submittingVibe}
      errorMessage={errorMessage}
      onCheckIn={handleVibeTap}
      onVibeTap={handleVibeTap}
    />
  )
}
