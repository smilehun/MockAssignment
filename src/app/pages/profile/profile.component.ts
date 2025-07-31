import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../shared/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent]
})
export class ProfileComponent implements OnInit {
    userProfile: UserProfile | null = null;
    loading = true;
    error: string | null = null;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.loadUserProfile();
    }

    private loadUserProfile() {
        this.loading = false;
        const user = this.authService.currentUserValue;
        if (user) {
            this.userProfile = user;
        } else {
            this.error = 'No user is currently logged in.';
        }
    }
}
