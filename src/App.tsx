import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import InterviewSetupPage from './pages/InterviewSetupPage'
import InterviewLivePage from './pages/InterviewLivePage'
import LandingPage from './pages/LandingPage'
import ProfilePage from './pages/ProfilePage'
import ReportPage from './pages/ReportPage'
import TemplatesPage from './pages/TemplatesPage'
import InterviewPreparationPage from './pages/InterviewPreparationPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const location = useLocation()

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          {/* Support both /login and /signup */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          {/* Legacy /auth redirect */}
          <Route path="/auth" element={<Navigate to="/login" replace />} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/templates"
            element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>}
          />
          <Route
            path="/interview/setup"
            element={<ProtectedRoute><InterviewSetupPage /></ProtectedRoute>}
          />
          <Route
            path="/interview/live"
            element={<ProtectedRoute><InterviewLivePage /></ProtectedRoute>}
          />
          <Route
            path="/interview/report"
            element={<ProtectedRoute><ReportPage /></ProtectedRoute>}
          />
          <Route
            path="/preparation"
            element={<ProtectedRoute><InterviewPreparationPage /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  )
}

export default App
