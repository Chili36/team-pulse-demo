import { useMoods } from './hooks/useMoods'
import { Header } from './components/Header'
import { MoodSelector } from './components/MoodSelector'
import { MoodChart } from './components/MoodChart'
import { VibeFeed } from './components/VibeFeed'
import { NewsTicker } from './components/NewsTicker'

export default function App() {
  const { moods, submitMood, loading, hasVoted, myVibe } = useMoods()

  return (
    <div className="min-h-screen text-brown" style={{ backgroundColor: '#d4a574' }}>
      {/* Corkboard texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(180,130,80,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(200,160,100,0.3) 0%, transparent 50%),
            radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 16px 16px, 23px 23px',
          backgroundPosition: '0 0, 0 0, 0 0, 11px 11px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-8 md:gap-12">
        <Header />

        <NewsTicker />

        <MoodSelector onSelect={submitMood} disabled={loading} hasVoted={hasVoted} myVibe={myVibe} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <MoodChart moods={moods} />
          <VibeFeed moods={moods} />
        </div>

        <footer className="text-center pb-6 pt-4">
          <p className="text-xs md:text-sm font-medium" style={{ color: '#5a3e28' }}>
            Built with agentic coding — cats & agents, zero regrets
          </p>
          <div className="mt-2 mx-auto flex items-center justify-center gap-2 text-sm">
            🐾 🐾 🐾
          </div>
        </footer>
      </div>
    </div>
  )
}
