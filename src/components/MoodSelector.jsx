import { useState } from 'react'
import { MOOD_OPTIONS } from '../constants/moods.js'

export function MoodSelector({ onSelect, disabled, hasVoted, myVibe }) {
  const [activeEmoji, setActiveEmoji] = useState(null)

  const handleClick = (value) => {
    if (disabled || hasVoted) return
    setActiveEmoji(value)
    onSelect(value)
    // Reset the click animation after a short delay
    setTimeout(() => setActiveEmoji(null), 600)
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-10">
        <h2 className="text-center text-lg md:text-xl font-semibold text-gray-300 mb-6 md:mb-8">
          {hasVoted ? 'Your vibe has been recorded!' : 'Cast your vibe'}
        </h2>

        <div
          className={`
            flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8
            ${disabled ? 'opacity-40 pointer-events-none' : ''}
            ${hasVoted ? 'pointer-events-none' : ''}
          `}
        >
          {MOOD_OPTIONS.map(({ emoji, label, value }) => {
            const isMyVote = hasVoted && myVibe === value
            const isFaded = hasVoted && myVibe !== value

            return (
              <button
                key={value}
                onClick={() => handleClick(value)}
                disabled={disabled || hasVoted}
                className={`
                  group flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl
                  transition-all duration-300 ease-out
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                  ${isMyVote ? 'scale-110 bg-white/15 ring-2 ring-purple-500/60' : ''}
                  ${isFaded ? 'opacity-25' : ''}
                  ${!hasVoted ? 'hover:bg-white/10 hover:scale-110 active:scale-95' : ''}
                  ${activeEmoji === value ? 'scale-125 bg-white/15' : ''}
                `}
                aria-label={label}
              >
                <span
                  className={`
                    text-5xl md:text-6xl transition-transform duration-300 ease-out
                    ${!hasVoted ? 'group-hover:scale-125' : ''}
                    ${activeEmoji === value ? 'animate-ping-once scale-130' : ''}
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

        {disabled && !hasVoted && (
          <p className="text-center text-sm text-purple-400 mt-4 animate-pulse">
            Submitting your vibe...
          </p>
        )}
      </div>
    </section>
  )
}
