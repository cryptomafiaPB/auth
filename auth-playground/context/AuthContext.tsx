/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { fetcher } from '../lib/api';

// ----- Types -----
interface User {
    _id: string;
    email: string;
    isVerified: boolean;
}

export type RegisterData = { name: string; email: string; password: string };
export type LoginData = { email: string; password: string };
export type ResetData = { token: string; password: string };
interface ProfileResponse { success: boolean; user: User; }


interface AuthContextType {
    user: User | null;
    isFetchingUser: boolean;
    register: (data: RegisterData) => Promise<User>;
    login: (data: LoginData) => Promise<User>;
    logout: () => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (data: ResetData) => Promise<void>;
}


// ----- Context -----
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----- Provider -----
export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);


    // 1) Fetch user 
    const { data, isLoading: isFetchingUser, isError } = useQuery<
        ProfileResponse,
        Error
    >({
        queryKey: ['currentUser'],
        queryFn: () =>
            fetcher<ProfileResponse>(`${process.env.BASE_URL}/auth/profile`, {
                credentials: 'include',
            }),
        retry: false,
    });

    // 2) Unwrap and store user in an effect
    useEffect(() => {
        if (data && data.success) {
            setUser(data.user);
        } else if (isError) {
            setUser(null);
        }
    }, [data, isError]);

    // ----- Mutations -----
    const registerMutation = useMutation<User, Error, RegisterData>({
        mutationFn: (payload) =>
            fetcher<User>(`${process.env.BASE_URL}/auth/register`, {
                method: 'POST',
                body: JSON.stringify(payload),
            }),
        onSuccess: (data) => {
            setUser(data);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });

    const loginMutation = useMutation<User, Error, LoginData>({
        mutationFn: (payload) =>
            fetcher<User>(`${process.env.BASE_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify(payload),

            }),
        onSuccess: (data) => {
            setUser(data);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });

    const logoutMutation = useMutation<void, Error>({
        mutationFn: () =>
            fetcher<void>(`${process.env.BASE_URL}/auth/logout`, { method: 'GET' }),
        onSuccess: () => {
            setUser(null);
            queryClient.removeQueries({ queryKey: ['currentUser'] });
        },
    });

    const verifyMutation = useMutation<void, Error, string>({
        mutationFn: (token) =>
            fetcher<void>(
                `${process.env.BASE_URL}/auth/verify/${encodeURIComponent(token)}`
            ),
    });

    const forgotMutation = useMutation<void, Error, string>({
        mutationFn: (email) =>
            fetcher<void>(`${process.env.BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                body: JSON.stringify({ email }),
            }),
    });

    const resetMutation = useMutation<void, Error, ResetData>({
        mutationFn: ({ token, password }) =>
            fetcher<void>(`${process.env.BASE_URL}/auth/reset-password/${encodeURIComponent(token)}`, {
                method: 'POST',
                body: JSON.stringify({ token, password }),
            }),
    });

    // ----- Context Methods -----
    const register = (data: RegisterData) => registerMutation.mutateAsync(data);
    const login = (data: LoginData) => loginMutation.mutateAsync(data);
    const logout = () => logoutMutation.mutateAsync();
    const verifyEmail = (token: string) => verifyMutation.mutateAsync(token);
    const forgotPassword = (email: string) => forgotMutation.mutateAsync(email);
    const resetPassword = (data: ResetData) => resetMutation.mutateAsync(data);

    return (
        <AuthContext.Provider
            value={{
                user,
                isFetchingUser,
                register,
                login,
                logout,
                verifyEmail,
                forgotPassword,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ----- Hook -----
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}