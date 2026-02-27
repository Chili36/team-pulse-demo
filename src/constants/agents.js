export const AI_AGENTS = {
  'a0000000-0000-0000-0000-000000000001': {
    name: 'Anxious Andy',
    avatar: '😰',
    color: '#f87171',
  },
  'a0000000-0000-0000-0000-000000000002': {
    name: 'Optimist Olivia',
    avatar: '🌟',
    color: '#34d399',
  },
  'a0000000-0000-0000-0000-000000000003': {
    name: 'Pragmatic Pat',
    avatar: '🧐',
    color: '#60a5fa',
  },
}

export function isAIAgent(sessionId) {
  return sessionId in AI_AGENTS
}

export function getAgentInfo(sessionId) {
  return AI_AGENTS[sessionId] || null
}
