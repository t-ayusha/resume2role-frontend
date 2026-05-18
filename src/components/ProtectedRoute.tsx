import { Navigate, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated && !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
