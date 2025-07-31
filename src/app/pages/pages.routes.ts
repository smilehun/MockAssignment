import { Routes } from '@angular/router';

import { UsersManagerComponent } from './managers/users-manager/users-manager.component';
import { authGuard } from '../guards/auth.guard';
import { AdminManagerComponent } from './managers/admin-manager/admin-manager.component';
import { ProfileComponent } from './profile/profile.component';

export default [
    { path: '', redirectTo: 'users-manager', pathMatch: 'full' },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'users-manager', component: UsersManagerComponent, canActivate: [authGuard] },
    { path: 'admin-manager', component: AdminManagerComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '/' }
] as Routes;
