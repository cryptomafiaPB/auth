/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoggerToggle from '@/components/LoggerToggle';
import CodeSnippet from '@/components/CodeSnippet';
import { LoginData } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const [form, setForm] = useState<LoginData>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(form);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    const codeExample = `
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${JSON.stringify(form, null, 2)}),
})
  .then(res => res.json())
  .then(data => console.log(data));
`.trim();

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full border rounded px-2 py-1"
                    />
                </div>

                <div>
                    <label className="block">Password</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        className="w-full border rounded px-2 py-1"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Log In
                </button>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">Login successful!</p>}
            </form>

            <div className="flex justify-between items-center">
                <Link href="/auth/signup" className="text-sm text-blue-500 hover:underline">
                    Don’t have an account? Sign up
                </Link>
                <Link href="/auth/forgot" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                </Link>
            </div>

            <div>
                <LoggerToggle />
            </div>

            <div>
                <h3 className="font-semibold">Code Preview</h3>
                <CodeSnippet code={codeExample} language="javascript" />
            </div>
        </div>
    );
}
