import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { fetchPlans, fetchSubscriptions, subscribeToPlan, updateSubscription } from '../lib/api.js'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [subs, setSubs] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      setError('')
      setLoading(true)
      try {
        const [plansData, subsData] = await Promise.all([
          fetchPlans(),
          fetchSubscriptions(),
        ])
        if (!isMounted) return
        setPlans(Array.isArray(plansData) ? plansData : [])
        setSubs(Array.isArray(subsData) ? subsData : [])
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

  function isSubscribed(planId) {
    return subs.some(s => s.plan_id === planId && s.active)
  }

  async function handleToggle(plan) {
    try {
      setSaving(true)
      const existing = subs.find(s => s.plan_id === plan.id)
      if (existing) {
        const updated = await updateSubscription({ id: existing.id, active: !existing.active })
        setSubs(prev => prev.map(s => s.id === existing.id ? { ...s, ...updated } : s))
      } else {
        const created = await subscribeToPlan({ planCode: plan.code })
        setSubs(prev => [created, ...prev])
      }
    } catch (err) {
      setError(err.message || 'Failed to update subscription')
    } finally {
      setSaving(false)
    }
  }

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
      {plans.map((p) => {
        const subscribed = isSubscribed(p.id)
        return (
          <Card key={p.id || p.code} title={p.name} subTitle={(p.code || '').replaceAll('_', ' ')}>
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm opacity-80 flex-1 flex-basis-28rem">{p.description}</p>
              <Button
                label={subscribed ? 'Unsubscribe' : 'Subscribe'}
                icon={subscribed ? 'pi pi-minus' : 'pi pi-plus'}
                outlined={!subscribed}
                severity={subscribed ? 'danger' : 'primary'}
                loading={saving}
                onClick={() => handleToggle(p)}
              />
            </div>
          </Card>
        )
      })}
    </div>
  )
}


