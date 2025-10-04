import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'

export default function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.({ email, password })
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
      <Button type="submit" label="Login" icon="pi pi-sign-in" loading={loading} />
    </form>
  )
}


