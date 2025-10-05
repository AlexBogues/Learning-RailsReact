import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { TabView, TabPanel } from 'primereact/tabview'
import Heatmap from '../components/Heatmap.jsx'
import { useDaily, useCompletions, useStreaks, useMarkCompletion } from '../hooks/useApi'
import { format, subDays, startOfYear } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import 'react-calendar-heatmap/dist/styles.css'

export default function Tracking() {
  const { data: daily, isLoading: loadingDaily, error: errorDaily } = useDaily()
  const { data: comps, isLoading: loadingComps, error: errorComps } = useCompletions()
  const { data: streaks, isLoading: loadingStreaks, error: errorStreaks } = useStreaks()
  const mark = useMarkCompletion()
  const navigate = useNavigate()

  const assignments = daily?.assignments || []
  const completions = comps || {}
  const loading = loadingDaily || loadingComps || loadingStreaks
  const error = errorDaily?.message || errorComps?.message || errorStreaks?.message || ''

  async function handleMarkComplete(assignment) {
    await mark.mutateAsync({ planId: assignment.plan_id, readingRef: assignment.reading_ref })
  }

  function getHeatmapData(planCode) {
    const planCompletions = completions[planCode] || {}
    const startDate = startOfYear(new Date())
    const endDate = new Date()
    const days = []
    for (let d = new Date(endDate); d >= startDate; d.setDate(d.getDate() - 1)) {
      const dateStr = format(d, 'yyyy-MM-dd')
      days.push({ date: new Date(d), count: planCompletions[dateStr] ? 1 : 0 })
    }
    return days
  }

  function getCombinedHeatmapData() {
    const startDate = startOfYear(new Date())
    const endDate = new Date()
    const days = []
    for (let d = new Date(endDate); d >= startDate; d.setDate(d.getDate() - 1)) {
      const dateStr = format(d, 'yyyy-MM-dd')
      let count = 0
      Object.values(completions).forEach(planCompletions => {
        if (planCompletions[dateStr]) count++
      })
      days.push({ date: new Date(d), count })
    }
    return days
  }

  if (loading) {
    return (
      <div className="max-w-4xl w-full flex justify-center p-8">
        <span className="pi pi-spin pi-spinner text-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl w-full">
        <Card title="Error">
          <p className="text-red-600 text-sm">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl w-full grid gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Daily Tracking</h1>
        <Button
          label="Manage Plans"
          icon="pi pi-cog"
          onClick={() => navigate('/plans')}
          outlined
        />
      </div>
      
      {/* Today's Assignments */}
      <Card title="Today's Reading" subTitle={format(new Date(), 'EEEE, MMMM do, yyyy')}>
        <div className="grid gap-4">
          {assignments.length === 0 ? (
            <p className="text-gray-600">No active reading plans. Subscribe to a plan to start tracking!</p>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.subscription_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{assignment.plan_name}</h3>
                  <p className="text-gray-600">{assignment.reading_ref}</p>
                  {assignment.completed && (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                      <i className="pi pi-check-circle"></i>
                      Completed
                    </span>
                  )}
                </div>
                <Button
                  label={assignment.completed ? "Completed" : "Mark as Read"}
                  icon={assignment.completed ? "pi pi-check" : "pi pi-book"}
                  severity={assignment.completed ? "success" : "primary"}
                  disabled={assignment.completed}
                  loading={mark.isLoading}
                  onClick={() => handleMarkComplete(assignment)}
                />
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Activity Tracking */}
      <Card title="Activity Tracking">
        <TabView>
          <TabPanel header="Combined">
            <div className="mt-4">
              <div className="mb-4">
                <h4 className="font-semibold mb-2">All Plans Combined</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Current streak: <span className="font-semibold">{streaks.combined?.current_streak || 0}</span> days | 
                  Longest streak: <span className="font-semibold">{streaks.combined?.longest_streak || 0}</span> days
                </p>
              </div>
              <Heatmap
                startDate={subDays(new Date(), 365)}
                endDate={new Date()}
                values={getCombinedHeatmapData()}
                classForValue={(value) => {
                  if (!value || value.count === 0) return 'color-empty'
                  return 'color-scale-1'
                }}
                tooltipForValue={(value) => value.date ? `${format(value.date, 'MMM dd, yyyy')}: ${value.count} plan${value.count !== 1 ? 's' : ''} completed` : 'No data'}
              />
            </div>
          </TabPanel>
          
          {assignments.map((assignment) => (
            <TabPanel key={assignment.subscription_id} header={assignment.plan_name}>
              <div className="mt-4">
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">{assignment.plan_name}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Current streak: <span className="font-semibold">
                      {streaks.plans?.find(p => p.plan_code === assignment.plan_code)?.current_streak || 0}
                    </span> days | 
                    Longest streak: <span className="font-semibold">
                      {streaks.plans?.find(p => p.plan_code === assignment.plan_code)?.longest_streak || 0}
                    </span> days
                  </p>
                </div>
                <Heatmap
                  startDate={subDays(new Date(), 365)}
                  endDate={new Date()}
                  values={getHeatmapData(assignment.plan_code)}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty'
                    return 'color-scale-1'
                  }}
                  tooltipForValue={(value) => value.date ? `${format(value.date, 'MMM dd, yyyy')}: ${value.count > 0 ? 'Completed' : 'Not completed'}` : 'No data'}
                />
              </div>
            </TabPanel>
          ))}
        </TabView>
      </Card>
    </div>
  )
}
