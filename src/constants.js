export const VIBE_VALUES = Object.freeze(['😄', '😊', '😐', '😟', '😢'])

export const VIBE_OPTIONS = Object.freeze([
  { value: '😄', label: 'energized', ariaLabel: 'Feeling energized' },
  { value: '😊', label: 'good', ariaLabel: 'Feeling good' },
  { value: '😐', label: 'steady', ariaLabel: 'Feeling steady' },
  { value: '😟', label: 'blocked', ariaLabel: 'Feeling blocked' },
  { value: '😢', label: 'burned out', ariaLabel: 'Feeling burned out' },
])

export const COPY = Object.freeze({
  appName: 'Team Pulse',
  eyebrow: 'Live team mood',
  title: 'Tap the vibe.',
  subtitle: 'Pick one signal. Watch the all-time trend move live.',
  prompt: 'How is the team feeling?',
  chartTitle: 'All-time check-ins',
  chartHint: 'Counts across every session.',
  emptyState: 'No check-ins yet. Be the first signal.',
  success: 'Checked in.',
  submitError: 'Check-in failed. Try again.',
})
