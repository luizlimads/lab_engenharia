import { AuthService } from './auth';

interface ApiOptions extends Omit<RequestInit, 'headers'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

const isProd = process.env.NODE_ENV === 'production';
const BASE_URL = isProd
  ? 'https://api.yourdomain.com'
  : 'http://localhost:8000';

export async function apiClient(
  path: string,
  { method = 'GET', body, ...rest }: ApiOptions = {},
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = AuthService.getToken();
  if (token) {
    console.debug('Using auth token for API requests');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!res.ok) {
    // try parse JSON error, or fallback to statusText
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || res.statusText);
  }

  console.debug(`API call: ${method} ${BASE_URL}${path}`, {
    body,
    status: res.status,
    statusText: res.statusText,
  });

  return res.json();
}
