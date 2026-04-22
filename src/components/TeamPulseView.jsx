import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { COPY, VIBE_OPTIONS } from '../constants.js'

const BAR_COLORS = Object.freeze({
  '😄': '#9EC2A0',
  '😊': '#B4CFA6',
  '😐': '#CBBF9A',
  '😟': '#D0A17A',
  '😢': '#B98072',
})

function formatCount(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace('.0', '')}k`
  }

  return `${value}`
}

function formatTimestamp(value) {
  if (!value) {
    return COPY.emptyState
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function ChartTooltipContent({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const entry = payload[0]?.payload
  const vibe = VIBE_OPTIONS.find((option) => option.value === entry?.vibe)

  return (
    <div className="pulse-tooltip">
      <p className="pulse-tooltip__value">
        <span aria-hidden="true">{entry.vibe}</span> {vibe?.label ?? 'unknown'}
      </p>
      <p className="pulse-tooltip__meta">{formatCount(entry.count)} total check-ins</p>
    </div>
  )
}

function StatusLine({ errorMessage, isLoading, latestEvent, totalCount }) {
  if (errorMessage) {
    return (
      <p className="pulse-status pulse-status--error" role="alert">
        {errorMessage}
      </p>
    )
  }

  if (isLoading) {
    return <p className="pulse-status">Loading every recorded check-in…</p>
  }

  if (!totalCount) {
    return <p className="pulse-status">{COPY.emptyState}</p>
  }

  return (
    <p className="pulse-status">
      <span className="pulse-status__accent">{COPY.success}</span>{' '}
      Latest: {latestEvent?.vibe ?? '—'} at {formatTimestamp(latestEvent?.created_at)}
    </p>
  )
}

export function TeamPulseView({
  chartData,
  totalCount,
  latestEvent,
  isLoading,
  errorMessage,
  submittingVibe,
  onVibeTap,
}) {
  const hasData = totalCount > 0

  return (
    <main className="pulse-shell">
      <section className="pulse-hero">
        <p className="pulse-eyebrow">{COPY.eyebrow}</p>
        <h1 className="pulse-title">{COPY.appName}</h1>
        <p className="pulse-subtitle">{COPY.subtitle}</p>
      </section>

      <section className="pulse-row pulse-row--composer" aria-labelledby="pulse-question">
        <div className="pulse-copy">
          <h2 id="pulse-question" className="pulse-section-title">
            {COPY.prompt}
          </h2>
          <p className="pulse-note">Five signals. One live room. No overthinking.</p>
        </div>

        <div className="pulse-picker" aria-label="Team mood picker">
          {VIBE_OPTIONS.map((option) => {
            const isSubmitting = submittingVibe === option.value

            return (
              <button
                key={option.value}
                type="button"
                className="pulse-chip"
                onClick={() => void onVibeTap(option.value)}
                disabled={Boolean(submittingVibe)}
                aria-label={option.ariaLabel}
                aria-pressed={isSubmitting}
              >
                <span className="pulse-chip__emoji" aria-hidden="true">
                  {option.value}
                </span>
                <span className="pulse-chip__label">{option.label}</span>
              </button>
            )
          })}
        </div>

        <StatusLine
          errorMessage={errorMessage}
          isLoading={isLoading}
          latestEvent={latestEvent}
          totalCount={totalCount}
        />
      </section>

      <section className="pulse-row pulse-row--chart" aria-labelledby="pulse-chart-title">
        <div className="pulse-chart-copy">
          <div>
            <h2 id="pulse-chart-title" className="pulse-section-title">
              {COPY.chartTitle}
            </h2>
            <p className="pulse-note">{COPY.chartHint}</p>
          </div>
          <p className="pulse-total">{formatCount(totalCount)} check-ins logged</p>
        </div>

        {hasData ? (
          <div className="pulse-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 12, bottom: 8, left: 0 }}>
                <CartesianGrid vertical={false} stroke="#D8D0C5" strokeDasharray="4 8" />
                <XAxis
                  axisLine={false}
                  dataKey="vibe"
                  tickLine={false}
                  tick={{ fill: '#3A3530', fontSize: 24 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6D655D', fontSize: 14 }}
                  tickFormatter={formatCount}
                  width={40}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(158, 194, 160, 0.16)' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" radius={[18, 18, 10, 10]} maxBarSize={72}>
                  <LabelList
                    dataKey="count"
                    position="top"
                    formatter={formatCount}
                    style={{ fill: '#3A3530', fontSize: 14, fontWeight: 700 }}
                  />
                  {chartData.map((entry) => (
                    <Cell key={entry.vibe} fill={BAR_COLORS[entry.vibe] ?? '#9EC2A0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="pulse-empty">{COPY.emptyState}</p>
        )}
      </section>
    </main>
  )
}
