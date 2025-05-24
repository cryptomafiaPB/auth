'use client';

import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface InAppEmailProps {
    to: string;
    subject: string;
    children: ReactNode;
    onDismiss: () => void;
    timestamp?: Date;
}

export default function InAppEmail({
    to,
    subject,
    children,
    onDismiss,
    timestamp = new Date(),
}: InAppEmailProps) {
    return (
        <Card className="max-w-lg mx-auto my-6 border-blue-300">
            <CardHeader>
                <CardTitle className="text-lg">{subject}</CardTitle>
                <p className="text-sm text-gray-600">To: {to}</p>
            </CardHeader>

            <CardContent className="prose dark:prose-invert">
                {children}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                    {format(timestamp, 'PPpp')}
                </p>
                <Button variant="outline" size="sm" onClick={onDismiss}>
                    Dismiss
                </Button>
            </CardFooter>
        </Card>
    );
}
