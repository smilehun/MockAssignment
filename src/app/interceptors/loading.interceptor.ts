import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export function loadingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> {
    const loadingService = inject(LoadingService);
    let totalRequests = 0;

    totalRequests++;
    loadingService.setLoading(true);

    return next(request).pipe(
        finalize(() => {
            totalRequests--;
            if (totalRequests === 0) {
                loadingService.setLoading(false);
            }
        })
    );
}
