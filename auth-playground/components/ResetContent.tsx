/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoggerToggle from '@/components/LoggerToggle';
import CodeSnippet from '@/components/CodeSnippet';

type ResetContentProps = {
    token: string;
};

export function ResetContent({ token }: ResetContentProps) {
    const { resetPassword } = useAuth();
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await resetPassword({ token, password });
            setStatus('success');
            setMessage('Password reset! You can now log in. Your will be redirect to login page in 3 seconds.');
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Reset failed.');
        }
    };

    const codeExample = `
fetch('/api/auth/reset-password?token=${token}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: '${password}' }),
})
  .then(res => res.json())
  .then(data => console.log(data));
`.trim();

    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!token ? (
                    <p className="text-red-600">Invalid or missing token.</p>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label className='mb-2' htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={status === 'loading'}>
                                {status === 'loading' ? 'Resetting…' : 'Reset Password'}
                            </Button>
                        </form>

                        {(status === 'success' || status === 'error') && (
                            <p className={`${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </p>
                        )}

                        <div className="mt-4">
                            <LoggerToggle />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-1">Code Preview</h3>
                            <CodeSnippet code={codeExample} language="javascript" />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}