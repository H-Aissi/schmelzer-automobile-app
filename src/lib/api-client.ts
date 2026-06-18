// T-004
'use client';

const BASE_URL = '/api/v1';

type ApiErrorDetail = { field: string; rule: string };

export class ApiError extends Error {
  statusCode: number;
  error: string;
  details: ApiErrorDetail[];

  constructor(
    message: string,
    statusCode: number,
    error: string,
    details: ApiErrorDetail[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: {
      statusCode?: number;
      error?: string;
      message?: string;
      details?: ApiErrorDetail[];
    } = {};
    try {
      body = await res.json();
    } catch {
      // response body nicht parsebar
    }
    throw new ApiError(
      body.message ?? 'Ein Fehler ist aufgetreten.',
      body.statusCode ?? res.status,
      body.error ?? 'INTERNAL',
      body.details ?? [],
    );
  }
  return res.json() as Promise<T>;
}

export const api = {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async del<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    return handleResponse<T>(res);
  },

  async postForm<T>(path: string, form: FormData): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });
    return handleResponse<T>(res);
  },
};
