import { AnimatePresence } from 'framer-motion'

import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import { ErrorBoundary } from './components/ErrorBoundary'

import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import InterviewLivePage from './pages/InterviewLivePage'
import InterviewPreparationPage from './pages/InterviewPreparationPage'
import InterviewSetupPage from './pages/InterviewSetupPage'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import ReportPage from './pages/ReportPage'
import TemplatesPage from './pages/TemplatesPage'

function App() {
  const location = useLocation()

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthPage initialMode="login" />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <AuthPage initialMode="signup" />
              </PublicRoute>
            }
          />

          {/* Legacy redirect */}
          <Route
            path="/auth"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* =========================
              PROTECTED ROUTES
          ========================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <TemplatesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/setup"
            element={
              <ProtectedRoute>
                <InterviewSetupPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/live"
            element={
              <ProtectedRoute>
                <InterviewLivePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview/report"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/preparation"
            element={
              <ProtectedRoute>
                <InterviewPreparationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* =========================
              404 ROUTE
          ========================= */}

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  )
}

export default App