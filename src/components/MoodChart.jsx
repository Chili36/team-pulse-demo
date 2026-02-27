import { MOOD_OPTIONS, VIBE_COLORS } from '../constants/moods.js'
import { isAIAgent } from '../constants/agents.js'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const { emoji, label, count } = payload[0].payload
  return (
    <div className="bg-gray-800/95 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-2xl text-center">{emoji}</p>
      <p className="text-sm text-gray-300 font-medium text-center">{label}</p>
      <p className="text-lg font-bold text-white text-center mt-1">
        {count} vote{count !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export function MoodChart({ moods }) {
  // Build chart data from mood counts
  const chartData = MOOD_OPTIONS.map(({ emoji, label, value, color }) => {
    const count = (moods || []).filter((m) => {
      // Handle both object and string mood entries
      const moodValue = typeof m === 'string' ? m : m?.emoji || m?.value || m?.vibe
      return moodValue === value
    }).length
    return { emoji, label, value, count, color }
  })

  const hasData = chartData.some((d) => d.count > 0)

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <span className="text-xl">📊</span> Vibe Distribution
        </h3>
        <p className="text-xs text-gray-500 mt-1 ml-8">Humans + AI agents combined</p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <span className="text-5xl mb-4 opacity-50">🫥</span>
          <p className="text-lg font-medium">No vibes yet</p>
          <p className="text-sm text-gray-600 mt-1">Be the first to cast yours!</p>
        </div>
      ) : (
        <div className="w-full h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
            >
              <XAxis
                dataKey="emoji"
                tick={{ fontSize: 28 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }}
              />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.value}
                    fill={VIBE_COLORS[entry.value] || '#8b5cf6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
