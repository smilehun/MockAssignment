import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator]
})
export class RegisterComponent {
    username: string = '';
    email: string = '';
    password: string = '';

    constructor(
        @Inject(AuthService) private authService: AuthService,
        private router: Router
    ) {}

    register() {
        this.authService.register({ username: this.username, email: this.email, password: this.password, role: 'user' }).subscribe(
            (response: any) => {
                console.log('Registration successful', response);
                alert('Registration successful! Please login.');
                this.router.navigate(['/auth/login']);
            },
            (error: any) => {
                console.error('Registration failed', error);
                // Handle registration error (e.g., display error message)
            }
        );
    }
}
