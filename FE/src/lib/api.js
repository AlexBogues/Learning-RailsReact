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


