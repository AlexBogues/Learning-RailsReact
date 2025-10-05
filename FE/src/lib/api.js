const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options,
  });

  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch (_) { json = null; }

  if (!res.ok) {
    if (res.status === 401) {
      try { localStorage.removeItem('access_token'); } catch (_) {}
      // Use hard redirect to reset app state and land on login
      if (typeof window !== 'undefined') {
        window.location.replace('/');
      }
    }
    const message = (json && (json.error || json.message)) || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return json;
}

export function register({ email, password, timezone }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, timezone })
  });
}

export function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function fetchPlans() {
  return request('/api/plans');
}

export function fetchSubscriptions() {
  return request('/api/subscriptions');
}

export function subscribeToPlan({ planCode, settings, timezone }) {
  return request('/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ planCode, settings, timezone })
  });
}

export function updateSubscription({ id, active, settings, timezone }) {
  return request(`/api/subscriptions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ active, settings, timezone })
  });
}

export function fetchBooks() {
  return request('/api/books');
}

export function fetchDaily() {
  return request('/api/daily');
}

export function markCompletion({ planId, date, readingRef }) {
  return request('/api/completions', {
    method: 'POST',
    body: JSON.stringify({ planId, date, readingRef })
  });
}

export function fetchCompletions({ from, to }) {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  return request(`/api/completions?${params.toString()}`);
}

export function fetchStreaks() {
  return request('/api/streaks');
}


