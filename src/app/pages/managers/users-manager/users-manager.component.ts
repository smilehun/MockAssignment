import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Ability } from '@casl/ability';
import { AbilityService } from '../../../services/ability.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User, UserRole, UserStatus } from '../../../shared/models/user.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-users-manager',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    templateUrl: './users-manager.component.html',
    styleUrl: './users-manager.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class UsersManagerComponent implements OnInit {
    ability!: Ability;
    userDialog: boolean = false;
    users = signal<User[]>([]);
    user!: User;
    selectedUsers!: User[] | null;
    submitted: boolean = false;
    statuses!: any[];
    roles!: any[];
    filteredRoles!: any[];
    canManageUsers: boolean = false; // New property to control UI elements
    private roleHierarchy = {
        [UserRole.Owner]: 3,
        [UserRole.Admin]: 2,
        [UserRole.User]: 1
    };

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private abilityService: AbilityService,
        private authService: AuthService,
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.ability = this.abilityService.getAbility();
        this.canManageUsers = this.ability.can('manage', 'user') || this.ability.can('manage', 'all'); // Set permission flag
        console.log('canManageUsers:', this.canManageUsers);
        console.log('Ability rules:', this.ability.rules);
        console.log('Can manage all:', this.ability.can('manage', 'all'));
        console.log('Current user:', this.authService.currentUserValue);
        this.loadUsers();

        this.statuses = [
            { label: 'Active', value: UserStatus.Active },
            { label: 'Inactive', value: UserStatus.Inactive },
            { label: 'Pending', value: UserStatus.Pending }
        ];

        this.roles = [
            { label: 'Admin', value: UserRole.Admin },
            { label: 'User', value: UserRole.User },
            { label: 'Owner', value: UserRole.Owner }
        ];

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'role', header: 'Role' },
            { field: 'status', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
        this.updateFilteredRoles();
    }

    loadUsers() {
        this.userService.getUsers().subscribe((data) => {
            this.users.set(data.filter(user => user.role === UserRole.User)); // Only display users with 'user' role
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    updateFilteredRoles() {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            this.filteredRoles = [];
            return;
        }

        if (currentUser.role === UserRole.Owner) {
            // Owners can assign 'admin' and 'user' roles
            this.filteredRoles = this.roles.filter(role => role.value === UserRole.Admin || role.value === UserRole.User);
        } else if (currentUser.role === UserRole.Admin) {
            // Admins can only assign the 'user' role
            this.filteredRoles = this.roles.filter(role => role.value === UserRole.User);
        } else {
            // Users cannot assign any roles
            this.filteredRoles = [];
        }
    }

    canManage(userToManage: User): boolean {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            return false;
        }

        // Owners can manage all users except themselves
        if (currentUser.role === UserRole.Owner) {
            return currentUser.id !== userToManage.id;
        }

        // For other roles, apply the hierarchy check
        const currentUserRoleLevel = this.roleHierarchy[currentUser.role];
        const userToManageRoleLevel = this.roleHierarchy[userToManage.role];

        return currentUserRoleLevel > userToManageRoleLevel;
    }

    openNew() {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to add new users.', life: 3000 });
            return;
        }
        this.updateFilteredRoles();
        this.user = {
            id: '',
            username: '',
            email: '',
            role: UserRole.User,
            name: '',
            status: UserStatus.Pending
        };
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(user: User) {
        if (!this.canManage(user)) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to edit this user.', life: 3000 });
            return;
        }
        this.updateFilteredRoles();
        this.user = { ...user };
        if (!this.user.id) {
            console.error('User ID is missing!');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User ID is missing!', life: 3000 });
            return;
        }
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to delete selected users.', life: 3000 });
            return;
        }
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteObservables = this.selectedUsers!.map(user => this.userService.deleteUser(user));
                Promise.all(deleteObservables.map(obs => obs.toPromise()))
                    .then(() => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Users Deleted',
                            life: 3000
                        });
                        this.selectedUsers = null;
                        this.loadUsers(); // Reload data from server
                    })
                    .catch((error) => {
                        console.error('Error deleting selected users', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete selected users',
                            life: 3000
                        });
                    });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    deleteUser(user: User) {
        if (!this.canManage(user)) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to delete this user.', life: 3000 });
            return;
        }
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.name + '?',
            header: 'Confirm',
            icon: 'pi pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUser(user).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Deleted',
                            life: 3000
                        });
                        this.loadUsers(); // Reload data from server
                    },
                    error: (error) => {
                        console.error('Error deleting user', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete user',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users().length; i++) {
            if (this.users()[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: UserStatus) {
        switch (status) {
            case UserStatus.Active:
                return 'success';
            case UserStatus.Inactive:
                return 'warn';
            case UserStatus.Pending:
                return 'info';
            default:
                return 'info';
        }
    }

    saveUser() {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to save users.', life: 3000 });
            return;
        }

        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
            const currentUserRoleLevel = this.roleHierarchy[currentUser.role];
            const targetUserRoleLevel = this.roleHierarchy[this.user.role];

            if (targetUserRoleLevel >= currentUserRoleLevel) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'You cannot assign a role equal to or higher than your own.',
                    life: 3000
                });
                return;
            }
        }

        this.submitted = true;

        if (this.user.name?.trim() && this.user.email?.trim() && this.user.role?.trim()) {
            if (this.user.id) {
                // Update existing user
                this.userService.updateUser(this.user).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Updated',
                            life: 3000
                        });
                        this.userDialog = false;
                        this.resetUser();
                        this.loadUsers(); // Reload data from server
                    },
                    error: (error) => {
                        console.error('Error updating user', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update user',
                            life: 3000
                        });
                    }
                });
            } else {
                // Create new user
                const { id, ...newUser } = this.user;
                console.log('newUser', newUser);
                this.userService.createUser(newUser).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Created',
                            life: 3000
                        });
                        this.userDialog = false;
                        this.resetUser();
                        this.loadUsers(); // Reload data from server
                    },
                    error: (error) => {
                        console.error('Error creating user', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create user',
                            life: 3000
                        });
                    }
                });
            }
        }
    }

    resetUser() {
        this.user = {
            id: '',
            username: '',
            email: '',
            role: UserRole.User,
            name: '',
            status: UserStatus.Pending
        };
    }
}
