'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    const { user, isFetchingUser, logout } = useAuth();
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isFetchingUser && !user) {
            router.replace('/auth/login');
            console.log('not authenticated and redirected');
        }
    }, [isFetchingUser, user, router]);

    console.log("user id: ", user?._id);

    if (isFetchingUser || !user) {
        return <p className="text-center mt-10">Loading profile…</p>;
    }


    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Welcome, {user.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>User ID: {user?._id}</p>
                <p>Email Verified: {user.isVerified ? 'Yes' : 'No'}</p>
                <Button variant="destructive" onClick={() => logout().then(() => router.push('/'))}>
                    Logout
                </Button>
            </CardContent>
        </Card>
    );
}
