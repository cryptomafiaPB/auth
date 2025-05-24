'use client';

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // adjust to your theme

interface Props {
    code: string;
    language?: string;
}

export default function CodeSnippet({ code, language = 'javascript' }: Props) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = code;
            hljs.highlightElement(ref.current);
        }
    }, [code]);

    return (
        <pre className="rounded bg-gray-900 text-white p-4 overflow-auto">
            <code ref={ref} className={language}></code>
        </pre>
    );
}
