'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { authAPI, profileApi } from '@/lib/api'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  username: string
  token?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (first_name: string, last_name: string, username: string, email: string, password: string) => Promise<void>
  updateUser: (updatedUser: Partial<User> | User) => void
  refreshProfile: () => Promise<void>
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
      const parsedUser = JSON.parse(storedUser)
      setUser({ ...parsedUser, token: storedToken })
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
      let errorMessage = 'Registration failed'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.resposeCode === 400) {
        errorMessage = error.message || 'Invalid input. Please check all fields.'
      }
      
      throw new Error(errorMessage)
    }
  }

  // Update user in state and localStorage
  const updateUser = (updatedUser: Partial<User> | User) => {
    if (!user) return
    
    const newUser = { ...user, ...updatedUser }
    setUser(newUser)
    
    // Update localStorage
    const { token, ...userWithoutToken } = newUser
    localStorage.setItem('user', JSON.stringify(userWithoutToken))
    
    // If token was updated, update it too
    if (updatedUser.token) {
      localStorage.setItem('token', updatedUser.token)
    }
  }

  // Refresh profile from API
  const refreshProfile = async () => {
    try {
      const response = await profileApi.getProfile()
      if (response.responseCode === 200 && response.result) {
        const userData = response.result
        // Preserve the token
        const currentToken = user?.token || localStorage.getItem('token')
        const userWithToken = { ...userData, token: currentToken }
        setUser(userWithToken)
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        console.error('Failed to refresh profile:', response.message)
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        register,
        updateUser,
        refreshProfile
      }}
    >
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