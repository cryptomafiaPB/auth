/* eslint-disable @typescript-eslint/no-explicit-any */
// components/NetworkInspector.tsx
'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LogEntry {
    url: string;
    method: string;
    status: number;
    duration: number;
    requestBody: any;
    responseBody: any;
}

export default function NetworkInspector() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useEffect(() => {
        const onLog = (e: CustomEvent) => {
            setLogs(prev => [e.detail, ...prev].slice(0, 100));
        };
        window.addEventListener('__network_log__', onLog as EventListener);
        return () => window.removeEventListener('__network_log__', onLog as EventListener);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-64 overflow-y-auto bg-white dark:bg-gray-900 shadow-lg border-t">
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b flex justify-between items-center px-[10%]">
                <span className="font-semibold">Network Logs ({logs.length})</span>
                <button
                    onClick={() => setLogs([])}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                    Clear
                </button>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log, i) => {
                    const isOpen = expandedIndex === i;
                    return (
                        <li key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 px-[10%]">
                            <button
                                className="w-full flex justify-between items-center p-3 focus:outline-none"
                                onClick={() => setExpandedIndex(isOpen ? null : i)}
                            >
                                <div className="flex flex-col text-left truncate">
                                    <span className="text-sm font-medium">
                                        <span className="uppercase mr-2">{log.method}</span>
                                        <span className="truncate">{log.url}</span>
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Status: {log.status} — {log.duration}ms
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {isOpen && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 space-y-2 border-t">
                                    <div>
                                        <div className="text-xs font-semibold">Request Body:</div>
                                        <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
                                            {JSON.stringify(log.requestBody, null, 2)}
                                        </pre>
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold">Response Body:</div>
                                        <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
                                            {JSON.stringify(log.responseBody, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
