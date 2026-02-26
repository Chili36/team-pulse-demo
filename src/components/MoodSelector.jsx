import { useState } from 'react'
import { MOOD_OPTIONS } from '../constants/moods.js'

export function MoodSelector({ onSelect, disabled }) {
  const [activeEmoji, setActiveEmoji] = useState(null)

  const handleClick = (value) => {
    if (disabled) return
    setActiveEmoji(value)
    onSelect(value)
    // Reset the click animation after a short delay
    setTimeout(() => setActiveEmoji(null), 600)
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-10">
        <h2 className="text-center text-lg md:text-xl font-semibold text-gray-300 mb-6 md:mb-8">
          Cast your vibe
        </h2>

        <div
          className={`
            flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8
            ${disabled ? 'opacity-40 pointer-events-none' : ''}
          `}
        >
          {MOOD_OPTIONS.map(({ emoji, label, value }) => (
            <button
              key={value}
              onClick={() => handleClick(value)}
              disabled={disabled}
              className={`
                group flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl
                transition-all duration-300 ease-out
                hover:bg-white/10 hover:scale-110
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                ${activeEmoji === value ? 'scale-125 bg-white/15' : ''}
              `}
              aria-label={label}
            >
              <span
                className={`
                  text-5xl md:text-6xl transition-transform duration-300 ease-out
                  group-hover:scale-125
                  ${activeEmoji === value ? 'animate-ping-once scale-130' : ''}
                `}
                role="img"
                aria-hidden="true"
              >
                {emoji}
              </span>
              <span className="text-xs md:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-200 font-medium text-center max-w-[100px] leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>

        {disabled && (
          <p className="text-center text-sm text-purple-400 mt-4 animate-pulse">
            Submitting your vibe...
          </p>
        )}
      </div>
    </section>
  )
}
