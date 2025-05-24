/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoggerToggle from '@/components/LoggerToggle';
import CodeSnippet from '@/components/CodeSnippet';
import InAppEmail from '@/components/InAppEmail';
import Link from 'next/link';

export default function ForgotPage() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [devToken, setDevToken] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const resp: any = await forgotPassword(email);
            if (resp.dev?.resetPasswordToken) {
                setDevToken(resp.dev.resetPasswordToken);
            }
            setStatus('success');
            setMessage(`If an account exists, a reset link was sent to ${email}.`);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Failed to send reset email.');
        }
    };


    if (devToken) {
        const link = `/auth/reset/${devToken}`;
        return (
            <InAppEmail
                to={email}
                subject="Reset your password"
                onDismiss={() => setDevToken(null)}
            >
                <p>You requested a password reset. Click below to choose a new password:</p>
                <Link href={link} className='hover:underline hover:text-blue-600 text-blue-500'>{link}</Link>
                <Button asChild className="mt-4">
                    <a href={link}>Reset Password</a>
                </Button>
            </InAppEmail >
        );
    }



    const codeExample = `
fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: '${email}' }),
})
  .then(res => res.json())
  .then(data => console.log(data));
`.trim();

    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
                    </Button>
                </form>

                {status === 'success' && (
                    <p className="text-green-600">{message}</p>
                )}
                {status === 'error' && (
                    <p className="text-red-600">{message}</p>
                )}

                <div className="mt-4">
                    <LoggerToggle />
                </div>

                <div>
                    <h3 className="text-sm font-semibold mb-1">Code Preview</h3>
                    <CodeSnippet code={codeExample} language="javascript" />
                </div>
            </CardContent>
        </Card>
    );
}
