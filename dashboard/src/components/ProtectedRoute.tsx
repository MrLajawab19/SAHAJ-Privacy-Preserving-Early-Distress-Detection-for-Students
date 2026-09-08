// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

type Props = {
  role: 'student' | 'parent'
  children: ReactNode
}

export default function ProtectedRoute({ role, children }: Props) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    // Redirect to the correct dashboard for their actual role
    return <Navigate to={user.role === 'student' ? '/student' : '/parent'} replace />
  }

  return <>{children}</>
}
