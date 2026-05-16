import type { ReactElement } from 'react'

import {
  Navigate,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function ProtectedRoute({
  children,
}: {
  children: ReactElement
}) {
  const {
    isAuthenticated,
    isAdmin,
    user,
  } = useAuth()

  const location = useLocation()

  const allowed =
    isAuthenticated ||
    isAdmin ||
    !!user

  if (!allowed) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  return children
}

export default ProtectedRoute