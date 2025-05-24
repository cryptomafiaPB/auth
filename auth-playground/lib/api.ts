// lib/api.ts
import type { FetchOptions } from './types';

export async function fetcher<T>(url: string, options: FetchOptions = {}): Promise<T> {
    const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await res.json()
        : await res.text();

    if (!res.ok) {
        const error = typeof data === 'string' ? data : data.message || JSON.stringify(data);
        throw new Error(error);
    }

    return data as T;
}
