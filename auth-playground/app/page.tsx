'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isFetchingUser, logout } = useAuth();
  const router = useRouter();

  if (isFetchingUser) return <p className="text-center mt-10">Loading...</p>;

  return <>{user ? <Card className="max-w-md mx-auto mt-10">
    <CardHeader>
      <CardTitle>Welcome, {user?.email}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p>User ID: {user?._id}</p>
      <p>Email Verified: {user?.isVerified ? 'Yes' : 'No'}</p>
      <Button variant="destructive" onClick={() => logout().then(() => router.push('/'))}>
        Logout
      </Button>
    </CardContent>
  </Card> : <p className="text-center mt-10">Not loged in</p>}</>;
}
