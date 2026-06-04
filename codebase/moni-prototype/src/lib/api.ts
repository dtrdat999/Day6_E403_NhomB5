const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
const localBackendUrl = 'http://127.0.0.1:8000';

const isLocalRuntime = () => {
  if (typeof window === 'undefined') return false;
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
};

const resolveApiEndpoints = (path: string) => {
  if (configuredApiBaseUrl) {
    return [`${configuredApiBaseUrl}${path}`];
  }

  if (isLocalRuntime()) {
    return [path, `${localBackendUrl}${path}`];
  }

  return [];
};

export const apiRequest = async (path: string, options?: RequestInit) => {
  const endpoints = resolveApiEndpoints(path);
  let lastError: unknown = new Error('Public backend URL is not configured');

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, options);
      if (res.ok) return res;
      lastError = new Error(`API error ${res.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('API unavailable');
};
