import { VIBE_LABELS, DISPLAY_EMOJI } from '../constants/moods.js'
import { getAgentInfo, isAIAgent } from '../constants/agents.js'

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

function getRawSessionId(mood) {
  if (typeof mood === 'string') return null
  return mood?.session_id || mood?.sessionId || null
}

function getComment(mood) {
  if (typeof mood === 'string') return null
  return mood?.comment || null
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
            const rawEmoji = getEmojiFromMood(mood)
            const displayEmoji = DISPLAY_EMOJI[rawEmoji] || rawEmoji
            const label = VIBE_LABELS[rawEmoji] || 'Unknown'
            const time = getRelativeTime(getTimestamp(mood))
            const session = getSessionId(mood)
            const fullSessionId = getRawSessionId(mood)
            const agentInfo = fullSessionId ? getAgentInfo(fullSessionId) : null
            const comment = getComment(mood)

            if (agentInfo) {
              // AI Agent entry
              return (
                <div
                  key={typeof mood === 'object' && mood?.id ? mood.id : `${rawEmoji}-${index}`}
                  className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-3 transition-all duration-500 hover:bg-white/10 animate-[slideDown_0.4s_ease-out]"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both',
                    borderLeft: `4px solid ${agentInfo.color}`,
                  }}
                >
                  {/* Agent avatar */}
                  <span className="text-3xl md:text-4xl flex-shrink-0">{agentInfo.avatar}</span>

                  {/* Agent info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold rounded-full px-2 py-0.5"
                        style={{
                          backgroundColor: `${agentInfo.color}20`,
                          color: agentInfo.color,
                        }}
                      >
                        {agentInfo.name}
                      </span>
                      <span className="text-[10px] text-gray-600 opacity-60">🤖</span>
                    </div>
                    <div className="flex items-start gap-2 mt-1">
                      <span className="text-lg flex-shrink-0">{displayEmoji}</span>
                      {comment && (
                        <p className="text-xs italic text-gray-400 leading-relaxed">
                          &ldquo;{comment}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <span className="flex-shrink-0 text-xs text-gray-500 mt-0.5">{time}</span>
                </div>
              )
            }

            // Human entry
            return (
              <div
                key={typeof mood === 'object' && mood?.id ? mood.id : `${rawEmoji}-${index}`}
                className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-3 transition-all duration-500 hover:bg-white/10 animate-[slideDown_0.4s_ease-out]"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                {/* Large emoji */}
                <span className="text-3xl md:text-4xl flex-shrink-0">{displayEmoji}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200">{label}</p>
                  {comment && (
                    <p className="text-xs italic text-gray-400 leading-relaxed mt-0.5">
                      &ldquo;{comment}&rdquo;
                    </p>
                  )}
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
