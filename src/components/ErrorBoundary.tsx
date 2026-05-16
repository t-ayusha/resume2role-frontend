import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Resume2Role error boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1020] px-4 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-2xl font-semibold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-white/50 mb-6">{this.state.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => { this.setState({ hasError: false, message: '' }); window.location.href = '/' }}
            className="rounded-xl bg-[#C7B8FF] px-6 py-3 text-sm font-semibold text-[#0B1020] hover:bg-white transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
