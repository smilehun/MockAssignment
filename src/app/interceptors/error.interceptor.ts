import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_CONSTANTS } from '../shared/constants/app.constants';

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> {
    const messageService = inject(MessageService);
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage: string = APP_CONSTANTS.ERROR_MESSAGES.UNEXPECTED_ERROR;

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = error.error.message;
            } else {
                // Server-side error
                switch (error.status) {
                    case 400:
                        errorMessage = APP_CONSTANTS.ERROR_MESSAGES.BAD_REQUEST;
                        break;
                    case 401:
                        errorMessage = APP_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED;
                        authService.logout();
                        router.navigate(['/auth/login']);
                        break;
                    case 403:
                        errorMessage = APP_CONSTANTS.ERROR_MESSAGES.FORBIDDEN;
                        break;
                    case 404:
                        errorMessage = APP_CONSTANTS.ERROR_MESSAGES.NOT_FOUND;
                        break;
                    case 500:
                        errorMessage = APP_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR;
                        break;
                    default:
                        errorMessage = `Error ${error.status}: ${error.message}`;
                }
            }

            messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: APP_CONSTANTS.DEFAULTS.TOAST_LIFE
            });

            return throwError(() => error);
        })
    );
}
