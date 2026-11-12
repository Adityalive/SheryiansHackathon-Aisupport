export const getApiBase = () => {
  if (typeof window !== 'undefined' && window.__API_BASE__) {
    return window.__API_BASE__.replace(/\/+$/, '');
  }

  const envApiUrl = import.meta?.env?.VITE_API_URL || import.meta?.env?.VITE_API_BASE_URL;
  if (envApiUrl) {
    return envApiUrl.replace(/\/+$/, '');
  }

  // Default to relative '/api' which works seamlessly in:
  // 1. Production (Express serving static frontend on Render / single-service)
  // 2. Development (Vite dev proxy forwarding /api to http://localhost:3000)
  return '/api';
};

export const API_BASE = getApiBase();
export default API_BASE;
