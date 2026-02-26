export function Header() {
  return (
    <header className="text-center py-8 md:py-12">
      {/* Glowing pulse ring behind the title */}
      <div className="relative inline-block">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl animate-pulse" />
        <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Team Pulse
          </span>
          <span className="inline-block ml-3 animate-bounce" aria-hidden="true">
            💓
          </span>
        </h1>
      </div>

      <p className="mt-4 text-lg md:text-xl text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
        How does your team feel about{' '}
        <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent font-semibold">
          agentic coding
        </span>
        ?
      </p>

      {/* Decorative divider */}
      <div className="mt-6 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-60" />
    </header>
  )
}
