import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext({ user: null, session: null, loading: true })

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => {
      isMounted = false
      sub.subscription?.unsubscribe?.()
    }
  }, [])

  const value = useMemo(() => ({ user, session, loading }), [user, session, loading])
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


