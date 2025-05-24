// components/InspectorContext.tsx
'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import NetworkInspector from './NetworkInspector';

type InspectorContextType = {
    open: boolean;
    toggle: () => void;
};

const InspectorContext = createContext<InspectorContextType | undefined>(
    undefined
);

export function InspectorProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    // Monkey‐patch fetch once, globally
    useEffect(() => {
        const orig = window.fetch;
        window.fetch = async (input, init) => {
            const start = Date.now();
            const res = await orig(input, init);
            const clone = res.clone();
            let body;
            try { body = await clone.json(); }
            catch { body = await clone.text(); }

            // You could also push into a ref here if you wanted
            window.dispatchEvent(
                new CustomEvent('__network_log__', {
                    detail: {
                        url:
                            typeof input === 'string'
                                ? input
                                : input instanceof Request
                                    ? input.url
                                    : input instanceof URL
                                        ? input.toString()
                                        : '',
                        method: init?.method ?? 'GET',
                        status: res.status,
                        duration: Date.now() - start,
                        requestBody: init?.body ? JSON.parse(init.body as string) : null,
                        responseBody: body,
                    },
                })
            );
            return res;
        };
        return () => {
            window.fetch = orig;
        };
    }, []);

    return (
        <InspectorContext.Provider
            value={{
                open,
                toggle: () => setOpen((v) => !v),
            }}
        >
            {children}
            {open && <NetworkInspector />}
        </InspectorContext.Provider>
    );
}

export function useInspector() {
    const ctx = useContext(InspectorContext);
    if (!ctx) throw new Error('useInspector must be inside InspectorProvider');
    return ctx;
}
