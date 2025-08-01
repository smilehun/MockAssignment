import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserProfile } from '../shared/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/api/users`; // Updated to include /api prefix

    constructor(private http: HttpClient) {}

    /**
     * Fetches the profile of the currently authenticated user.
     * @returns An Observable that emits the UserProfile object.
     */
    getCurrentUser(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${environment.apiUrl}/api/me`).pipe(catchError(this.handleError));
    }

    /**
     * Fetches a list of all users.
     * @returns An Observable that emits an array of User objects.
     */
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    /**
     * Fetches a single user by their ID.
     * @param id The ID of the user to fetch.
     * @returns An Observable that emits the User object.
     */
    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    /**
     * Creates a new user.
     * @param user The user object to create (excluding the ID).
     * @returns An Observable that emits the newly created User object.
     */
    createUser(user: Omit<User, 'id'>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user).pipe(catchError(this.handleError));
    }

    /**
     * Updates an existing user.
     * @param user A partial User object containing the ID and fields to update.
     * @returns An Observable that emits the updated User object.
     */
    updateUser(user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Partially updates an existing user.
     * @param user A partial User object containing the ID and fields to update.
     * @returns An Observable that emits the updated User object.
     */
    patchUser(user: Partial<User>): Observable<User> {
        return this.http.patch<any>(`${this.apiUrl}/${user.id}`, user).pipe(
            map(response => response.user),
            catchError(this.handleError)
        );
    }

    /**
     * Deletes a user.
     * @param user The user object to delete.
     * @returns An Observable that completes when the user is deleted.
     */
    deleteUser(user: User): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${user.id}`).pipe(catchError(this.handleError));
    }

    /**
     * Fetches users filtered by their role.
     * @param role The role to filter users by.
     * @returns An Observable that emits an array of User objects matching the role.
     */
    getUsersByRole(role: string): Observable<User[]> {
        return this.getUsers().pipe(map((users) => users.filter((user) => user.role === role)));
    }

    /**
     * Fetches a list of active users.
     * @returns An Observable that emits an array of active User objects.
     */
    getActiveUsers(): Observable<User[]> {
        return this.getUsers().pipe(map((users) => users.filter((user) => user.status === 'active')));
    }

    private handleError(error: any) {
        console.error('An error occurred:', error);
        return throwError(() => error);
    }
}
