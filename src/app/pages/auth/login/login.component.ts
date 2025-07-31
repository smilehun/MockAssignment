import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../../services/auth.service';
import { AbilityService } from '../../../services/ability.service';
import { User } from '../../../shared/models/user.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    checked: boolean = false;

    constructor(
        private authService: AuthService,
        private abilityService: AbilityService,
        private router: Router,
        private messageService: MessageService
    ) {}

    login() {
        if (!this.username || !this.password) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter both username and password'
            });
            return;
        }

        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: (user: User) => {
                console.log('Login successful');
                this.abilityService.updateAbility(user.role);
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.error('Login failed:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: error.message || 'Invalid credentials'
                });
            }
        });
    }
}
