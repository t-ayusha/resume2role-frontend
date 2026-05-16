import type { ReactElement } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function PublicRoute({
  children,
}: {
  children: ReactElement
}) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return children
}

export default PublicRoute