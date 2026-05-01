'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { authAPI } from '@/lib/api'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  username: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (first_name: string, last_name: string, username: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password)
      
      if (response.resposeCode === 200 && response.result) {
        const userData = response.result
        setUser(userData)
        setIsAuthenticated(true)
        
        // Store token and user in localStorage
        localStorage.setItem('token', userData.token)
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      // Extract meaningful error message
      let errorMessage = 'Login failed'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.resposeCode === 401) {
        errorMessage = 'Invalid username or password'
      } else if (error?.resposeCode === 404) {
        errorMessage = 'User not found'
      }
      
      throw new Error(errorMessage)
    }
  }

  const register = async (first_name: string, last_name: string, username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(first_name, last_name, username, email, password)
      
      if (response.resposeCode === 201) {
        // After registration, auto-login
        await login(username, password)
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error: any) {
      // Extract meaningful error message
      let errorMessage = 'Registration failed'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.resposeCode === 400) {
        errorMessage = error.message || 'Invalid input. Please check all fields.'
      }
      
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
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