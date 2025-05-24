'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const cls = document.documentElement.classList;
        setIsDark(cls.contains('dark'));
    }, []);

    const toggle = () => {
        const cls = document.documentElement.classList;
        if (cls.contains('dark')) {
            cls.remove('dark');
            setIsDark(false);
        } else {
            cls.add('dark');
            setIsDark(true);
        }
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}
