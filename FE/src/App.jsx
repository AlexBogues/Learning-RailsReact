import { useState } from 'react'
import { Card } from 'primereact/card'
import { login, register } from './lib/api.js'
import AuthTabs from './components/AuthTabs'
import Alert from './components/Alert'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card title="Welcome" className="w-full max-w-md">
        <AuthTabs onLogin={handleLogin} onRegister={handleRegister} loading={loading} />
        <Alert type="error">{error}</Alert>
        <Alert type="success">{success}</Alert>
      </Card>
    </div>
  )
}
