/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type VerificationContentProps = {
    token: string;
};

export function VerificationContent({ token }: VerificationContentProps) {
    const { verifyEmail } = useAuth();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token provided.');
                return;
            }

            try {
                setStatus('loading');
                await verifyEmail(token);
                setStatus('success');
                setMessage('Your email has been verified! You can now log in.');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || 'Verification failed.');
            }
        };

        if (status === 'idle') {
            verifyToken();
        }
    }, [token, verifyEmail, status]);

    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Email Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {status === 'loading' && <p>Verifying…</p>}
                {status === 'error' && (
                    <>
                        <p className="text-red-600">{message}</p>
                        <Button variant="outline" onClick={() => router.push('/auth/signup')}>
                            Back to Sign Up
                        </Button>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <p className="text-green-600">{message}</p>
                        <Button onClick={() => router.push('/auth/login')}>Go to Login</Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}