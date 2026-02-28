import { useState } from 'react'
import { MOOD_OPTIONS } from '../constants/moods.js'

export function MoodSelector({ onSelect, disabled, hasVoted, myVibe }) {
  const [selectedVibe, setSelectedVibe] = useState(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleEmojiClick = (value) => {
    if (disabled || hasVoted) return
    setSelectedVibe(value)
  }

  const handleSubmit = async () => {
    if (!selectedVibe || submitting) return
    setSubmitting(true)
    try {
      await onSelect(selectedVibe, comment.trim() || undefined)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkip = async () => {
    if (!selectedVibe || submitting) return
    setSubmitting(true)
    try {
      await onSelect(selectedVibe)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedOption = MOOD_OPTIONS.find((m) => m.value === selectedVibe)

  return (
    <section className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-10">
        <h2 className="text-center text-lg md:text-xl font-semibold text-gray-300 mb-6 md:mb-8">
          {hasVoted
            ? 'Your vibe has been recorded!'
            : selectedVibe
              ? 'Tell us why (optional)'
              : 'Cast your vibe'}
        </h2>

        {/* Emoji picker — shown when no vibe selected yet, or when voted */}
        <div
          className={`
            flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8
            ${disabled ? 'opacity-40 pointer-events-none' : ''}
            ${hasVoted || selectedVibe ? 'pointer-events-none' : ''}
            ${selectedVibe && !hasVoted ? 'hidden' : ''}
          `}
        >
          {MOOD_OPTIONS.map(({ emoji, label, value }) => {
            const isMyVote = hasVoted && myVibe === value
            const isFaded = hasVoted && myVibe !== value

            return (
              <button
                key={value}
                onClick={() => handleEmojiClick(value)}
                disabled={disabled || hasVoted}
                className={`
                  group flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl
                  transition-all duration-300 ease-out
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                  ${isMyVote ? 'scale-110 bg-white/15 ring-2 ring-purple-500/60' : ''}
                  ${isFaded ? 'opacity-25' : ''}
                  ${!hasVoted ? 'hover:bg-white/10 hover:scale-110 active:scale-95' : ''}
                `}
                aria-label={label}
              >
                <span
                  className={`
                    text-5xl md:text-6xl transition-transform duration-300 ease-out
                    ${!hasVoted ? 'group-hover:scale-125' : ''}
                  `}
                  role="img"
                  aria-hidden="true"
                >
                  {emoji}
                </span>
                <span className={`
                  text-xs md:text-sm transition-colors duration-200 font-medium text-center max-w-[100px] leading-tight
                  ${isMyVote ? 'text-purple-300' : 'text-gray-400'}
                  ${!hasVoted ? 'group-hover:text-gray-200' : ''}
                `}>
                  {isMyVote ? 'Your vibe' : label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Comment step — shown after picking an emoji */}
        {selectedVibe && !hasVoted && (
          <div className="flex flex-col items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedOption?.emoji}</span>
              <span className="text-gray-400 font-medium">{selectedOption?.label}</span>
              <button
                onClick={() => setSelectedVibe(null)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors ml-2"
              >
                change
              </button>
            </div>

            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Tell us why..."
              maxLength={100}
              disabled={submitting}
              className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              autoFocus
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={handleSkip}
                disabled={submitting}
                className="px-4 py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {disabled && !hasVoted && !selectedVibe && (
          <p className="text-center text-sm text-purple-400 mt-4 animate-pulse">
            Loading...
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
