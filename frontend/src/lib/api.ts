/**
 * @fileoverview ASHENRITUAL Architecture
 * @module api.ts
 */
import { useAuthStore } from '@/store/auth.store';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = useAuthStore.getState().token;
  
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && path !== '/auth/refresh' && path !== '/auth/login') {
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        failedQueue.push({ resolve: () => resolve(apiRequest<T>(path, options)), reject });
      });
    }

    isRefreshing = true;
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!refreshResponse.ok) {
        useAuthStore.getState().logout();
        throw new Error('Refresh token expired');
      }

      const data = await refreshResponse.json();
      const newToken = data.accessToken;
      
      useAuthStore.getState().setToken(newToken);
      processQueue(null, newToken);

      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
      }
      
      const retryResponse = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
      });

      if (!retryResponse.ok) {
        throw new ApiError(retryResponse.status, `API Error: ${retryResponse.status} ${retryResponse.statusText}`);
      }

      const text = await retryResponse.text();
      return text ? JSON.parse(text) : ({} as T);
    } catch (err) {
      processQueue(err as Error, null);
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    let message = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      // Ignore JSON parse error
    }
    throw new ApiError(response.status, message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
