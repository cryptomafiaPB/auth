// components/LoggerToggle.tsx
'use client';

import { useInspector } from './InspectorContext';
import { Button } from './ui/button';

export default function LoggerToggle() {
    const { open, toggle } = useInspector();
    return (
        <Button
            onClick={toggle}
            className='cursor-pointer'
        >
            {open ? 'Hide Logs' : 'Show Logs'}
        </Button>
    );
}
