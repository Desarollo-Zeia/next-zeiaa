'use client'

import React, { createContext, useContext, useCallback } from 'react'

interface AuthContextType {
  getToken: () => string | null
  setToken: (token: string | null) => void
  removeToken: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }, [])

  const setToken = useCallback((token: string | null) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token)
      } else {
        localStorage.removeItem('authToken')
      }
    }
  }, [])

  const removeToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ getToken, setToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

