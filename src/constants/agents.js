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
  'a0000000-0000-0000-0000-000000000004': {
    name: 'Startup Steve',
    avatar: '🚀',
    color: '#f59e0b',
  },
  'a0000000-0000-0000-0000-000000000005': {
    name: 'Doomer Donna',
    avatar: '💀',
    color: '#991b1b',
  },
  'a0000000-0000-0000-0000-000000000006': {
    name: 'Chill Charlie',
    avatar: '😎',
    color: '#06b6d4',
  },
  'a0000000-0000-0000-0000-000000000007': {
    name: 'Hacker Holly',
    avatar: '💻',
    color: '#8b5cf6',
  },
  'a0000000-0000-0000-0000-000000000008': {
    name: 'Manager Mike',
    avatar: '📊',
    color: '#ea580c',
  },
  'a0000000-0000-0000-0000-000000000009': {
    name: 'Ethics Elena',
    avatar: '⚖️',
    color: '#0d9488',
  },
  'a0000000-0000-0000-0000-00000000000a': {
    name: 'Junior Jess',
    avatar: '🌱',
    color: '#65a30d',
  },
}

export function isAIAgent(sessionId) {
  return sessionId in AI_AGENTS
}

export function getAgentInfo(sessionId) {
  return AI_AGENTS[sessionId] || null
}
