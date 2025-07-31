import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Inject } from '@angular/core';
import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, NgIf, LogoComponent],
    templateUrl: './app.topbar.html'
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        @Inject(Router) private router: Router
    ) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    goToLogin() {
        this.router.navigate(['/auth/login']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}
