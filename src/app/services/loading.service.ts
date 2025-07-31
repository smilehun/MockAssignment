import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    setLoading(loading: boolean): void {
        this.isLoadingSubject.next(loading);
    }

    getLoading(): boolean {
        return this.isLoadingSubject.value;
    }
}
