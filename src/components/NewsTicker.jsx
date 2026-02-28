import { useState, useEffect } from 'react'

export function NewsTicker() {
  const [headlines, setHeadlines] = useState([])

  useEffect(() => {
    fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10')
      .then((res) => res.json())
      .then((data) => {
        setHeadlines(data.hits?.map((h) => h.title).filter(Boolean) || [])
      })
      .catch(() => {})
  }, [])

  if (headlines.length === 0) return null

  const tickerText = headlines.join('  \u2022  ')

  return (
    <div className="overflow-hidden rounded-md py-1.5 px-3 text-xs font-medium"
      style={{ background: 'rgba(60,40,20,0.2)' }}>
      <div className="flex items-center gap-2">
        <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ background: '#ffe066', color: '#3d2e1f' }}>
          📰 Live
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-[ticker_30s_linear_infinite] whitespace-nowrap"
            style={{ color: '#f5edd6' }}>
            {tickerText}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
