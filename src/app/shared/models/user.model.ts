export enum UserRole {
    Admin = 'admin',
    User = 'user',
    Owner = 'owner'
}

export enum UserStatus {
    Active = 'active',
    Inactive = 'inactive',
    Pending = 'pending'
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    name: string;
    status: UserStatus;
    lastLogin?: string;
    password?: string; // For API responses only
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    name: string;
    role: UserRole;
    status: UserStatus;
    lastLogin?: string;
}
