'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (email: string, password: string) => {
    // TODO: Call your backend API
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: undefined,
    }
    setUser(mockUser)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const register = async (email: string, password: string, name: string) => {
    // TODO: Call your backend API
    const mockUser: User = {
      id: '1',
      email,
      name,
      avatar: undefined,
    }
    setUser(mockUser)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
