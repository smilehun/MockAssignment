export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user' | 'owner';
    name: string;
    status: 'active' | 'inactive' | 'pending';
    lastLogin?: string;
    password?: string; // For API responses only
}

export type UserRole = 'admin' | 'user' | 'owner';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'owner';
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'owner';
    status: 'active' | 'inactive' | 'pending';
    lastLogin?: string;
}
