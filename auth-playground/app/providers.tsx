// app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { InspectorProvider } from '@/components/InspectorContext';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <InspectorProvider>

                <AuthProvider>
                    {children}
                </AuthProvider>
            </InspectorProvider>
        </QueryClientProvider>
    );
}
