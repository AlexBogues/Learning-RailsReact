import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { fetchPlans, fetchSubscriptions, subscribeToPlan, updateSubscription, fetchBooks } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'
import PlanCard from '../components/PlanCard.jsx'
import BookChapterPicker from '../components/BookChapterPicker.jsx'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [subs, setSubs] = useState([])
  const [saving, setSaving] = useState(false)
  const [books, setBooks] = useState([])
  const [drafts, setDrafts] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setError('')
      setLoading(true)
      try {
        const [plansData, subsData, booksData] = await Promise.all([
          fetchPlans(),
          fetchSubscriptions(),
          fetchBooks(),
        ])
        if (!isMounted) return
        setPlans(Array.isArray(plansData) ? plansData : [])
        setSubs(Array.isArray(subsData) ? subsData : [])
        setBooks(Array.isArray(booksData) ? booksData : [])

        // Initialize drafts for daily_chapter from existing subscription or defaults
        const nextDrafts = {}
        const dailyPlan = (Array.isArray(plansData) ? plansData : []).find(p => p.code === 'daily_chapter')
        if (dailyPlan) {
          const sub = (Array.isArray(subsData) ? subsData : []).find(s => s.plan_id === dailyPlan.id)
          const defaultBook = (Array.isArray(booksData) && booksData[0]?.name) || 'Genesis'
          const startBook = sub?.settings?.startBook || defaultBook
          const maxCh = (Array.isArray(booksData) ? booksData : []).find(b => b.name === startBook)?.chapter_count || 1
          const startChapter = Math.min(Math.max(parseInt(sub?.settings?.startChapter || 1, 10), 1), maxCh)
          nextDrafts[dailyPlan.id] = { startBook, startChapter }
        }
        setDrafts(nextDrafts)
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
        const payload = { planCode: plan.code }
        if (plan.code === 'daily_chapter') {
          const d = drafts[plan.id] || {}
          payload.settings = { startBook: d.startBook, startChapter: d.startChapter }
        }
        const created = await subscribeToPlan(payload)
        setSubs(prev => [created, ...prev])
      }
    } catch (err) {
      setError(err.message || 'Failed to update subscription')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveSettings(plan) {
    try {
      setSaving(true)
      const existing = subs.find(s => s.plan_id === plan.id)
      if (!existing) return
      const d = drafts[plan.id] || {}
      const updated = await updateSubscription({ id: existing.id, settings: { startBook: d.startBook, startChapter: d.startChapter } })
      setSubs(prev => prev.map(s => s.id === existing.id ? { ...s, ...updated } : s))
    } catch (err) {
      setError(err.message || 'Failed to save settings')
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reading Plans</h1>
        <Button
          label="View Tracking"
          icon="pi pi-chart-line"
          onClick={() => navigate('/tracking')}
          outlined
        />
      </div>
      {plans.map((p) => {
        const subscribed = isSubscribed(p.id)
        const actions = p.code === 'daily_chapter' ? (
          <BookChapterPicker
            books={books}
            value={drafts[p.id]}
            onChange={(val) => setDrafts(prev => ({ ...prev, [p.id]: val }))}
            onBlur={() => { if (subscribed) handleSaveSettings(p) }}
            showSave={subscribed}
            onSave={() => handleSaveSettings(p)}
            saving={saving}
          />
        ) : null

        return (
          <PlanCard
            key={p.id || p.code}
            plan={p}
            description={p.description}
            actions={actions}
            subscribed={subscribed}
            onToggle={() => handleToggle(p)}
            loading={saving}
          />
        )
      })}
    </div>
  )
}


