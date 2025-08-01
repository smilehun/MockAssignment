import { Routes } from '@angular/router';

import { authGuard } from '../guards/auth.guard';

export default [
    { path: '', redirectTo: 'users-manager', pathMatch: 'full' },
    { path: 'profile', loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent), canActivate: [authGuard] },
    { path: 'users-manager', loadComponent: () => import('./managers/users-manager/users-manager.component').then((m) => m.UsersManagerComponent), canActivate: [authGuard] },
    { path: 'admin-manager', loadComponent: () => import('./managers/admin-manager/admin-manager.component').then((m) => m.AdminManagerComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: '/' }
] as Routes;
