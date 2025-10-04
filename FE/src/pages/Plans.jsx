import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { fetchPlans } from '../lib/api.js'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      setError('')
      setLoading(true)
      try {
        const data = await fetchPlans()
        if (!isMounted) return
        setPlans(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Failed to load plans')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    })()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl w-full flex justify-center p-8">
        <span className="pi pi-spin pi-spinner text-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl w-full">
        <Card title="Plans">
          <p className="text-red-600 text-sm">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl w-full grid gap-4">
      {plans.map((p) => (
        <Card key={p.id || p.code} title={p.name} subTitle={(p.code || '').replaceAll('_', ' ')}>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm opacity-80">{p.description}</p>
            <Button label="Subscribe" icon="pi pi-plus" outlined onClick={() => {}} />
          </div>
        </Card>
      ))}
    </div>
  )
}


