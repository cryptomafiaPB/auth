// lib/types.ts
export type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: string;
    credentials?: RequestCredentials;
};
