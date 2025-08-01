import { Injectable } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() { }

  setToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getFromStorage(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeFromStorage(key: string): void {
    localStorage.removeItem(key);
  }

    // Function to check if a user has a required role
  public hasRequiredRole(user: User, requiredRole: UserRole): boolean {
    if (!user || !user.role) {
      return false; // User or role is not defined
    }

    // Define role hierarchy
    const roleHierarchy: { [role in UserRole]: number } = {
      [UserRole.Owner]: 2,
      [UserRole.Admin]: 1,
      [UserRole.User]: 0
    };
    return false;
    }

    /**
     * Validate email format
     */
    public isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     */
    public isStrongPassword(password: string): boolean {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * Get initials from name
     */
    public getInitials(name: string): string {
        if (!name) return '';
        const nameParts = name?.split(' ');
        if (!nameParts) return '';
        return nameParts
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    /**
     * Format date
     */
    public formatDate(date: string | Date): string {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
