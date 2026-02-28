export function Header() {
  return (
    <header className="flex items-center justify-center gap-3 pt-4 pb-2">
      <span className="text-2xl">🐾</span>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brown">
        Cats <span className="text-coral">&</span> Agents
      </h1>
      <span className="text-lg" style={{ color: '#5a3e28' }}>
        — how does your team feel about{' '}
        <span className="font-bold px-1.5 py-0.5 rounded text-sm"
          style={{ backgroundColor: '#ffe066', color: '#3d2e1f' }}>
          agentic coding
        </span>?
      </span>
    </header>
  )
}
