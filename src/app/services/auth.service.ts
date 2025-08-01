import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, switchMap, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AbilityService } from './ability.service';
import { environment } from '../../environments/environment';
import { User, LoginCredentials, RegisterData, UserProfile } from '../shared/models/user.model';
import { APP_CONSTANTS } from '../shared/constants/app.constants';
import { UtilsService } from '../shared/services/utils.service';
import { UserService } from './user.service'; // Import UserService

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/users`;
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;
    private readonly TOKEN_KEY = APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN;
    private readonly USER_KEY = APP_CONSTANTS.STORAGE_KEYS.CURRENT_USER;
    private tokenSubject: BehaviorSubject<string | null>;
    public token: Observable<string | null>;

    constructor(
        private http: HttpClient,
        private abilityService: AbilityService,
        private utilsService: UtilsService,
        private userService: UserService // Inject UserService
    ) {
        const initialUser = this.utilsService.getFromStorage(this.USER_KEY);
        const initialToken = this.utilsService.getFromStorage(this.TOKEN_KEY);

        this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
        this.currentUser = this.currentUserSubject.asObservable();

        this.tokenSubject = new BehaviorSubject<string | null>(initialToken);
        this.token = this.tokenSubject.asObservable();

        // Initialize ability based on the current user
        if (initialUser && initialUser.role) {
            this.abilityService.updateAbility(initialUser.role);
        } else {
            this.abilityService.updateAbility(APP_CONSTANTS.USER_ROLES.OWNER);
        }
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public getToken(): string | null {
        return this.tokenSubject.value;
    }

    login(credentials: LoginCredentials): Observable<User> {
        return this.http.post<{ message: string; user: User; token: string }>(`${this.apiUrl}/login`, credentials).pipe(
            map((response) => {
                if (!response || !response.user || !response.token) {
                    throw new Error(APP_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
                }

                const user = response.user;
                const token = response.token;

                if (user.status !== APP_CONSTANTS.USER_STATUSES.ACTIVE) {
                    throw new Error(APP_CONSTANTS.ERROR_MESSAGES.ACCOUNT_INACTIVE);
                }

                const userResponse: User = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    status: user.status,
                    lastLogin: new Date().toISOString()
                };

                // Store user data and token
                this.utilsService.setToStorage(this.USER_KEY, userResponse);
                this.utilsService.setToStorage(this.TOKEN_KEY, token);
                this.currentUserSubject.next(userResponse);
                this.tokenSubject.next(token);
                this.abilityService.updateAbility(user.role);

                // Update last login time
                this.updateLastLogin(user.id).subscribe();

                return userResponse;
            }),
            catchError((error) => {
                console.error('Login error:', error);
                return throwError(() => new Error(error.error?.message || APP_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS));
            })
        );
    }

    register(userData: RegisterData): Observable<User> {
        const userToRegister = {
            ...userData,
            name: userData.name,
            role: userData.role || APP_CONSTANTS.USER_ROLES.USER,
            status: APP_CONSTANTS.USER_STATUSES.ACTIVE
        };
        return this.userService.createUser(userToRegister).pipe(
            catchError((error) => {
                console.error('Registration error:', error);
                return throwError(() => new Error(error.error?.message || APP_CONSTANTS.ERROR_MESSAGES.REGISTRATION_FAILED));
            })
        );
    }

    logout(): void {
        this.utilsService.removeFromStorage(this.USER_KEY);
        this.utilsService.removeFromStorage(this.TOKEN_KEY);
        this.currentUserSubject.next(null);
        this.tokenSubject.next(null);
        this.abilityService.updateAbility(APP_CONSTANTS.USER_ROLES.OWNER);
    }

    // Method to update user profile
    updateUser(user: UserProfile): Observable<User> {
        return this.userService.updateUser(user).pipe(
            tap((updatedUser: User) => {
                if (updatedUser) {
                    this.utilsService.setToStorage(this.USER_KEY, updatedUser);
                    this.currentUserSubject.next(updatedUser);
                    this.abilityService.updateAbility(updatedUser.role);
                }
            }),
            catchError((error) => {
                console.error('Update user error:', error);
                return throwError(() => new Error(error.error?.message || APP_CONSTANTS.ERROR_MESSAGES.UNEXPECTED_ERROR));
            })
        );
    }

    isLoggedIn(): boolean {
        return !!this.currentUserSubject.value && !!this.tokenSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value && !!this.tokenSubject.value;
    }

    changePassword(userId: number, passwordData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${userId}/password`, passwordData).pipe(
            tap((response: any) => {
                // Optionally, update the currentUser in localStorage and BehaviorSubject
                // if the password change also requires a user update.
                // localStorage.setItem('currentUser', JSON.stringify(response.user));
                // this.currentUserSubject.next(response.user);
            })
        );
    }

    private updateLastLogin(userId: string): Observable<any> {
        const updateData = { lastLogin: new Date().toISOString() };
        return this.http.patch(`${this.apiUrl}/${userId}`, updateData);
    }
}
