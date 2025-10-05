import { useQuery, useMutation, useQueryClient } from 'react-query'
import { fetchDaily, fetchCompletions, fetchStreaks, markCompletion, fetchPlans, fetchSubscriptions, fetchBooks, subscribeToPlan, updateSubscription } from '../lib/api'
import { format, startOfYear } from 'date-fns'

export function useDaily() {
  return useQuery(['daily'], fetchDaily)
}

export function useCompletions() {
  const from = format(startOfYear(new Date()), 'yyyy-MM-dd')
  const to = format(new Date(), 'yyyy-MM-dd')
  return useQuery(['completions', from, to], () => fetchCompletions({ from, to }))
}

export function useStreaks() {
  return useQuery(['streaks'], fetchStreaks)
}

export function useMarkCompletion() {
  const qc = useQueryClient()
  return useMutation(({ planId, readingRef }) => markCompletion({ planId, readingRef }), {
    onSuccess: () => {
      qc.invalidateQueries(['completions'])
      qc.invalidateQueries(['streaks'])
      qc.invalidateQueries(['daily'])
    },
  })
}

export function usePlansData() {
  return useQuery(['plans'], fetchPlans)
}

export function useSubscriptions() {
  return useQuery(['subscriptions'], fetchSubscriptions)
}

export function useBooks() {
  return useQuery(['books'], fetchBooks)
}

export function useSubscribeToPlan() {
  const qc = useQueryClient()
  return useMutation(subscribeToPlan, {
    onSuccess: () => {
      qc.invalidateQueries(['subscriptions'])
      qc.invalidateQueries(['daily'])
    },
  })
}

export function useUpdateSubscription() {
  const qc = useQueryClient()
  return useMutation(updateSubscription, {
    onSuccess: () => {
      qc.invalidateQueries(['subscriptions'])
      qc.invalidateQueries(['daily'])
    },
  })
}


