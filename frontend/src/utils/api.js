// Shared API utility - reads JWT token from localStorage and sets Authorization header

const BASE_URL = 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function getHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  });

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new ApiError('Unauthorized', 401, null);
  }

  if (!res.ok) {
    let body;
    try {
      body = await res.json();
    } catch {
      body = await res.text().catch(() => null);
    }
    const message =
      (body && typeof body === 'object' && (body.detail || body.error)) ||
      (body && typeof body === 'string' && body) ||
      res.statusText ||
      'Request failed';
    throw new ApiError(message, res.status, body);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
};
