/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import LoggerToggle from '@/components/LoggerToggle';
import CodeSnippet from '@/components/CodeSnippet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils'; // optional clsx wrapper
import { set } from 'zod/v4';
import { Loader } from 'lucide-react';
import InAppEmail from '@/components/InAppEmail';
import Link from 'next/link';

// Zod schema for validation
const SignupSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type SignupData = z.infer<typeof SignupSchema>;

export default function SignUpPage() {
    const { register } = useAuth();
    const [form, setForm] = useState<SignupData>({ name: '', email: '', password: '' });
    const [devToken, setDevToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof SignupData, string>>>({});
    const [ok, setOk] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const handleChange = (key: keyof SignupData, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        setLoading(true);
        // Validate
        const result = SignupSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: any = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) fieldErrors[err.path[0]] = err.message;
            });
            setLoading(false);
            return setErrors(fieldErrors);
        }

        try {
            const resp = await register(form);
            // Destructure the dev token from response
            if ((resp as any).dev?.verificationToken) {
                setDevToken((resp as any).dev.verificationToken);
                setOk(true);
                setLoading(false);
            }
        } catch (err: any) {
            setServerError(err.message);
            setLoading(false);
        }
    };

    // If we have a dev token, show the in-app email
    if (devToken) {
        const link = `/auth/verify/${devToken}`;
        return (
            <InAppEmail
                to={form.email}
                subject="Please verify your email"
                onDismiss={() => setDevToken(null)}
            >
                <p>Thanks for signing up! To activate your account, click the button below:</p>
                <Link href={link} className=' text-blue-500 hover:text-blue-600 hover:underline'>{link}</Link>
                <Button asChild className="mt-4">
                    <a href={link}>Verify Email</a>
                </Button>
            </InAppEmail >
        );
    }

    const codeExample = `
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${JSON.stringify(form, null, 2)}),
})
  .then(res => res.json())
  .then(data => console.log(data))
`.trim();

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className='mb-2' htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                        />
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>
                    {/* Add a loading */}
                    <Button type="submit" className={`w-full cursor-pointer ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                        {loading ? <Loader className="animate-spin mr-2" /> : 'Register'}
                    </Button>
                    {serverError && <p className="text-sm text-red-600">{serverError}</p>}
                    {ok && <p className="text-sm text-green-600">Registration successful! Check your email to verify.</p>}
                </form>

                <div className="flex justify-end">
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
