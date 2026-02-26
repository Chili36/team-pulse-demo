import { useMoods } from './hooks/useMoods'
import { Header } from './components/Header'
import { MoodSelector } from './components/MoodSelector'
import { MoodChart } from './components/MoodChart'
import { VibeFeed } from './components/VibeFeed'

export default function App() {
  const { moods, submitMood, loading, hasVoted, myVibe } = useMoods()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Subtle radial glow behind the page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-8 md:gap-12">
        {/* Header */}
        <Header />

        {/* Hero: Mood Selector */}
        <MoodSelector onSelect={submitMood} disabled={loading} hasVoted={hasVoted} myVibe={myVibe} />

        {/* Dashboard: Chart + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <MoodChart moods={moods} />
          <VibeFeed moods={moods} />
        </div>

        {/* Footer */}
        <footer className="text-center pb-6 pt-4">
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            Built with agentic coding — 5 AI agents, zero humans
          </p>
          <div className="mt-2 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30" />
        </footer>
      </div>
    </div>
  )
}
