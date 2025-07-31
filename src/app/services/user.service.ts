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

    getCurrentUser(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${environment.apiUrl}/api/me`).pipe(catchError(this.handleError));
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    createUser(user: Omit<User, 'id'>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user).pipe(catchError(this.handleError));
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(catchError(this.handleError));
    }

    deleteUser(user: User): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${user.id}`).pipe(catchError(this.handleError));
    }

    getUsersByRole(role: string): Observable<User[]> {
        return this.getUsers().pipe(map((users) => users.filter((user) => user.role === role)));
    }

    getActiveUsers(): Observable<User[]> {
        return this.getUsers().pipe(map((users) => users.filter((user) => user.status === 'active')));
    }

    private handleError(error: any) {
        console.error('An error occurred:', error);
        return throwError(() => error);
    }
}
