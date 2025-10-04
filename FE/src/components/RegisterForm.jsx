import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { TIMEZONES } from '../lib/timezones'

export default function RegisterForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [timezone, setTimezone] = useState('UTC')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.({ email, password, timezone })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <InputText 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email"
        required 
      />
      <Password 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder="Password"
        feedback={false} 
        required 
      />
      <Dropdown value={timezone} onChange={e => setTimezone(e.value)} options={TIMEZONES} placeholder="Timezone" />
      <Button type="submit" label="Create Account" icon="pi pi-user-plus" loading={loading} />
    </form>
  )
}


