import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    /**
     * Safely get item from localStorage
     */
    getFromStorage(key: string): any {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Safely set item to localStorage
     */
    setToStorage(key: string, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }

    /**
     * Remove item from localStorage
     */
    removeFromStorage(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    /**
     * Clear all app-related data from localStorage
     */
    clearAppData(): void {
        Object.values(APP_CONSTANTS.STORAGE_KEYS).forEach((key) => {
            this.removeFromStorage(key);
        });
    }

    /**
     * Format date to readable string
     */
    formatDate(date: string | Date): string {
        if (!date) return '';

        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Generate a unique ID
     */
    generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Debounce function
     */
    debounce<T extends (...args: any[]) => any>(func: T, wait: number = APP_CONSTANTS.DEFAULTS.DEBOUNCE_TIME): (...args: Parameters<T>) => void {
        let timeout: any;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    /**
     * Check if user has required role
     */
    hasRole(userRole: string, requiredRole: string): boolean {
        const roleHierarchy = {
            [APP_CONSTANTS.USER_ROLES.OWNER]: 2,
            [APP_CONSTANTS.USER_ROLES.ADMIN]: 1,
            [APP_CONSTANTS.USER_ROLES.USER]: 0
        };

        return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy];
    }

    /**
     * Validate email format
     */
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     */
    isStrongPassword(password: string): boolean {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * Get initials from name
     */
    getInitials(name: string): string {
        if (!name) return '';
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
}
