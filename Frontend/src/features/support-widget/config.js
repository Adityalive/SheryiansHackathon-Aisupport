import { API_BASE } from '../../config/api.config';

const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');

export const getSupportWidgetApiBase = () => {
  if (typeof window === 'undefined') return API_BASE;

  const script = document.currentScript || document.querySelector('script[data-business-id]');
  const scriptApiBase = script?.getAttribute('data-api-base');
  const windowApiBase = window.__SUPPORT_WIDGET_CONFIG__?.apiBase;
  const envApiBase = import.meta?.env?.VITE_API_BASE_URL || import.meta?.env?.VITE_API_URL;

  return (
    trimTrailingSlash(windowApiBase) ||
    trimTrailingSlash(scriptApiBase) ||
    trimTrailingSlash(envApiBase) ||
    API_BASE
  );
};

