import { useState } from 'react'
import { Card } from 'primereact/card'
import { TabView, TabPanel } from 'primereact/tabview'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { login, register } from './lib/api.js'

const timezones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'America/Chicago', value: 'America/Chicago' },
  { label: 'America/Denver', value: 'America/Denver' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
]

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleRegister(e) {
    e.preventDefault()
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

  async function handleLogin(e) {
    e.preventDefault()
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
        <TabView>
          <TabPanel header="Login">
            <form onSubmit={handleLogin} className="grid gap-3">
              <span className="p-input-icon-left">
                <i className="pi pi-envelope" />
                <InputText value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
              </span>
              <span className="p-input-icon-left">
                <i className="pi pi-lock" />
                <Password value={password} onChange={e => setPassword(e.target.value)} toggleMask feedback={false} placeholder="Password" inputStyle={{ width: '100%' }} required />
              </span>
              <Button type="submit" label="Login" icon="pi pi-sign-in" loading={loading} />
            </form>
          </TabPanel>
          <TabPanel header="Register">
            <form onSubmit={handleRegister} className="grid gap-3">
              <span className="p-input-icon-left">
                <i className="pi pi-envelope" />
                <InputText value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
              </span>
              <span className="p-input-icon-left">
                <i className="pi pi-lock" />
                <Password value={password} onChange={e => setPassword(e.target.value)} toggleMask feedback={false} placeholder="Password" inputStyle={{ width: '100%' }} required />
              </span>
              <Dropdown value={timezone} onChange={e => setTimezone(e.value)} options={timezones} placeholder="Timezone" />
              <Button type="submit" label="Create Account" icon="pi pi-user-plus" loading={loading} />
            </form>
          </TabPanel>
        </TabView>
        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}
      </Card>
    </div>
  )
}
