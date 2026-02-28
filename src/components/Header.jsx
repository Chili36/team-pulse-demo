export function Header() {
  return (
    <header className="text-center py-8 md:py-12">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brown">
        Cats & Agents
        <span className="inline-block ml-3" aria-hidden="true">
          🐾
        </span>
      </h1>

      <p className="mt-4 text-lg md:text-xl text-brown-muted font-medium max-w-xl mx-auto leading-relaxed">
        How does your team feel about{' '}
        <span className="text-coral font-semibold">
          agentic coding
        </span>
        ?
      </p>

      <div className="mt-6 mx-auto w-24 border-t-2 border-dashed border-beige" />
    </header>
  )
}
