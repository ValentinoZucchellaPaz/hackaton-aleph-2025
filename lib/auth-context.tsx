"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { mockApi, type User } from "./mock-data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (provider: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (simulate checking localStorage/session)
    const checkAuth = () => {
      const savedUserId = localStorage.getItem("payhub_user_id")
      if (savedUserId) {
        const userData = mockApi.getUser(savedUserId)
        if (userData) {
          setUser(userData)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (provider: string) => {
    setIsLoading(true)

    // Simulate OAuth flow delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful OAuth login - in real app this would handle the OAuth callback
    const mockUser = mockApi.getUser("user_1")
    if (mockUser) {
      // Update user's connected wallet info based on provider
      const updatedUser = {
        ...mockUser,
        mercadoPagoConnected: provider === "mercadopago" ? true : mockUser.mercadoPagoConnected,
      }

      setUser(updatedUser)
      localStorage.setItem("payhub_user_id", updatedUser.id)
    }

    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("payhub_user_id")
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
