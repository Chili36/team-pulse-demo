import { VIBE_LABELS } from '../constants/moods.js'

function getRelativeTime(timestamp) {
  if (!timestamp) return 'just now'
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)

  if (diffSec < 10) return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return 'a while ago'
}

function getEmojiFromMood(mood) {
  if (typeof mood === 'string') return mood
  return mood?.emoji || mood?.value || mood?.vibe || '❓'
}

function getTimestamp(mood) {
  if (typeof mood === 'string') return null
  return mood?.created_at || mood?.timestamp || null
}

function getSessionId(mood) {
  if (typeof mood === 'string') return null
  const id = mood?.session_id || mood?.sessionId || null
  return id ? id.slice(0, 6) : null
}

export function VibeFeed({ moods }) {
  const recentMoods = (moods || []).slice(0, 10)

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 h-full">
      <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
        <span className="text-xl">⚡</span> Live Vibes
      </h3>

      {recentMoods.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <span className="text-5xl mb-4 opacity-50 animate-pulse">👀</span>
          <p className="text-lg font-medium">Waiting for vibes...</p>
          <p className="text-sm text-gray-600 mt-1">Submissions will appear here live</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {recentMoods.map((mood, index) => {
            const emoji = getEmojiFromMood(mood)
            const label = VIBE_LABELS[emoji] || 'Unknown'
            const time = getRelativeTime(getTimestamp(mood))
            const session = getSessionId(mood)

            return (
              <div
                key={typeof mood === 'object' && mood?.id ? mood.id : `${emoji}-${index}`}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-3 transition-all duration-500 hover:bg-white/10 animate-[slideDown_0.4s_ease-out]"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                {/* Large emoji */}
                <span className="text-3xl md:text-4xl flex-shrink-0">{emoji}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{time}</p>
                </div>

                {/* Session indicator */}
                {session && (
                  <span className="flex-shrink-0 text-[10px] font-mono text-gray-600 bg-white/5 rounded-md px-2 py-0.5">
                    #{session}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Inline keyframes for slide animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
