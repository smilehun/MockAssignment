import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from './app/shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, LoadingSpinnerComponent],
    template: `
        <app-loading-spinner></app-loading-spinner>
        <router-outlet></router-outlet>
    `
})
export class AppComponent {}
