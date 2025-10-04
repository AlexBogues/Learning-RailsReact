import { useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { login, register } from './lib/api.js'
import AuthTabs from './components/AuthTabs'
import Alert from './components/Alert'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Plans from './pages/Plans.jsx'

function AppInner() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('access_token'))
  const navigate = useNavigate()

  async function handleRegister({ email, password, timezone }) {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await register({ email, password, timezone })
      setSuccess('Registered successfully. You can now login.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin({ email, password }) {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const data = await login({ email, password })
      setSuccess(`Logged in. Access token: ${data.session?.access_token?.slice(0, 8)}...`)
      const token = data?.session?.access_token
      if (token) localStorage.setItem('access_token', token)
      setIsLoggedIn(true)
      navigate('/plans', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/plans" replace />
          ) : (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
              <Card title="Welcome" className="w-full max-w-md">
                <AuthTabs onLogin={handleLogin} onRegister={handleRegister} loading={loading} />
                <Alert type="error">{error}</Alert>
                <Alert type="success">{success}</Alert>
              </Card>
            </div>
          )
        }
      />
      <Route
        path="/plans"
        element={
          isLoggedIn ? (
            <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
              <Plans />
            </div>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? '/plans' : '/'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
