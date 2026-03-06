import { useState, useEffect } from 'react'

export function NewsTicker() {
  const [headlines, setHeadlines] = useState([])

  useEffect(() => {
    fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10')
      .then((res) => res.json())
      .then((data) => {
        setHeadlines(data.hits?.filter((h) => h.title).map((h) => ({ title: h.title, url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}` })) || [])
      })
      .catch(() => {})
  }, [])

  if (headlines.length === 0) return null

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
            {headlines.map((h, i) => (
              <span key={i}>
                {i > 0 && '  \u2022  '}
                <a href={h.url} target="_blank" rel="noopener noreferrer"
                  className="hover:underline" style={{ color: '#ffe066' }}>{h.title}</a>
              </span>
            ))}
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
