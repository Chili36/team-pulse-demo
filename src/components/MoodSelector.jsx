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
      <div className="relative border-none shadow-[2px_4px_16px_rgba(80,50,20,0.25)] rounded-lg p-6 md:p-10 rotate-[-0.8deg]"
        style={{ background: 'linear-gradient(145deg, #f5edd6, #f0e6c8)' }}>
        {/* Washi tape decoration */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-8 rounded-sm rotate-[1.5deg] overflow-hidden"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              rgba(224,96,80,0.35),
              rgba(224,96,80,0.35) 4px,
              rgba(255,224,102,0.4) 4px,
              rgba(255,224,102,0.4) 8px
            )`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }} />
        <h2 className="text-center text-lg md:text-xl font-semibold text-brown-muted mb-6 md:mb-8">
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
                  focus:outline-none focus:ring-2 focus:ring-coral/50 focus:ring-offset-2 focus:ring-offset-cream
                  ${isMyVote ? 'scale-110 bg-beige-light ring-2 ring-coral/60' : ''}
                  ${isFaded ? 'opacity-25' : ''}
                  ${!hasVoted ? 'hover:bg-beige-light hover:scale-110 active:scale-95' : ''}
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
                  ${isMyVote ? 'text-coral' : 'text-brown-muted'}
                  ${!hasVoted ? 'group-hover:text-brown' : ''}
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
              <span className="text-brown-muted font-medium">{selectedOption?.label}</span>
              <button
                onClick={() => setSelectedVibe(null)}
                className="text-xs text-brown-muted hover:text-brown transition-colors ml-2"
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
              className="w-full max-w-md bg-cream border border-beige rounded-xl px-4 py-3 text-sm text-brown placeholder-brown-muted/50 focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-transparent transition-all"
              autoFocus
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-coral hover:bg-coral-hover disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={handleSkip}
                disabled={submitting}
                className="px-4 py-2 text-brown-muted hover:text-brown text-sm transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {disabled && !hasVoted && !selectedVibe && (
          <p className="text-center text-sm text-coral mt-4 animate-pulse">
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
