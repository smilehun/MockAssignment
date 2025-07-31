import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'profile', loadComponent: () => import('./app/pages/profile/profile.component').then((m) => m.ProfileComponent) },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes').then((m) => m.default) }
        ]
    },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes').then((m) => m.default) },
    { path: '**', redirectTo: '/' }
];
