import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../services/auth.service';
import { AbilityService } from '../../services/ability.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of menuItems(); let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    private authService = inject(AuthService);
    private abilityService = inject(AbilityService);

    // Reactive state management using signals
    private isLoggedIn = signal(false);
    private userRole = signal('owner');

    // Computed menu items based on authentication and permissions
    menuItems = computed(() => {
        const baseItems: MenuItem[] = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            }
        ];

        // Only show management pages if user is logged in
        if (this.isLoggedIn()) {
            const managementItems: MenuItem[] = [];
            const role = this.userRole();

            // owner, admin, and user can see User Manager
            if (role === 'owner' || role === 'admin' || role === 'user') {
                managementItems.push({
                    label: 'User Manager',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/pages/users-manager']
                });
            }
            // owner and admin can see Admin Manager
            if (role === 'owner' || role === 'admin') {
                managementItems.push({
                    label: 'Admin Manager',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['/pages/admin-manager']
                });
            }
            if (managementItems.length > 0) {
                baseItems.push({
                    label: 'Management',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/pages'],
                    items: managementItems
                });
            }
        }
        return baseItems;
    });

    ngOnInit() {
        // Subscribe to authentication state changes
        this.authService.currentUser.subscribe((user) => {
            this.isLoggedIn.set(!!user);
            this.userRole.set(user?.role || 'owner');
        });
    }
}
