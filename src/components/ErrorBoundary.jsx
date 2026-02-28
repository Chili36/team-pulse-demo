import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-8">
          <div className="bg-card border border-beige rounded-2xl p-8 max-w-md text-center shadow-[0_2px_12px_rgba(120,80,40,0.08)]">
            <span className="text-6xl block mb-4">🙀</span>
            <h1 className="text-xl font-bold text-brown mb-2">Something went wrong</h1>
            <p className="text-brown-muted mb-6 text-sm">{this.state.error?.message}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="px-6 py-2 bg-coral hover:bg-coral-hover text-white rounded-xl transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
