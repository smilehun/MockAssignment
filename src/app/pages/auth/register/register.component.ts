import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../shared/models/user.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [CommonModule, ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator]
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;

    constructor(
        @Inject(AuthService) private authService: AuthService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    register() {
        if (this.registerForm.valid) {
            const { name, username, email, password } = this.registerForm.value;
            this.authService.register({ name, username, email, password, role: UserRole.User }).subscribe(
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
        } else {
            // Mark all fields as touched to display validation messages
            this.registerForm.markAllAsTouched();
        }
    }
}
