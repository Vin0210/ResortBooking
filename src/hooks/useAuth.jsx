/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabase'

/**
 * Auth context. Uses Supabase Auth in production; in demo mode
 * (no Supabase configured) any email/password combination opens
 * the admin so the dashboard can be showcased to clients.
 */
const AuthContext = createContext(null)

const DEMO_SESSION_KEY = 'azure_cove_demo_admin'

function readDemoSession() {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    isSupabaseConfigured ? null : readDemoSession()
  )
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const isDemo = !isSupabaseConfigured

  useEffect(() => {
    if (isDemo) return undefined
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [isDemo])

  async function login(email, password) {
    if (!isDemo) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data.user
    }
    if (!email || password.length < 4) {
      throw new Error('Enter a valid email and a password of at least 4 characters.')
    }
    const demoUser = { email, name: email.split('@')[0] }
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
    return demoUser
  }

  async function signOut() {
    if (!isDemo) return supabase.auth.signOut()
    localStorage.removeItem(DEMO_SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signOut, isDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
