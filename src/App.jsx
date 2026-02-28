import { useMoods } from './hooks/useMoods'
import { Header } from './components/Header'
import { MoodSelector } from './components/MoodSelector'
import { MoodChart } from './components/MoodChart'
import { VibeFeed } from './components/VibeFeed'

export default function App() {
  const { moods, submitMood, loading, hasVoted, myVibe } = useMoods()

  return (
    <div className="min-h-screen bg-cream text-brown">
      {/* Subtle dot texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #c8b89a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-8 md:gap-12">
        <Header />

        <MoodSelector onSelect={submitMood} disabled={loading} hasVoted={hasVoted} myVibe={myVibe} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <MoodChart moods={moods} />
          <VibeFeed moods={moods} />
        </div>

        <footer className="text-center pb-6 pt-4">
          <p className="text-xs md:text-sm text-brown-muted font-medium">
            Built with agentic coding — cats & agents, zero regrets
          </p>
          <div className="mt-2 mx-auto flex items-center justify-center gap-1 text-brown-muted/40 text-xs">
            🐾 🐾 🐾
          </div>
        </footer>
      </div>
    </div>
  )
}
