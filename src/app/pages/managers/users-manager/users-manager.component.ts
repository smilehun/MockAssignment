import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Ability } from '@casl/ability';
import { AbilityService } from '../../../services/ability.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user.model';
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
    canManageUsers: boolean = false; // New property to control UI elements

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
        console.log('Can manage user:', this.ability.can('manage', 'user'));
        console.log('Current user:', this.authService.currentUserValue);
        this.loadUsers();

        this.statuses = [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Pending', value: 'pending' }
        ];

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'role', header: 'Role' },
            { field: 'status', header: 'Status' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadUsers() {
        this.userService.getUsers().subscribe((data) => {
            this.users.set(data);
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to add new users.', life: 3000 });
            return;
        }
        this.user = {
            id: '',
            username: '',
            email: '',
            role: 'user',
            name: '',
            status: 'pending'
        };
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(user: User) {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to edit users.', life: 3000 });
            return;
        }
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
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Users Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    deleteUser(user: User) {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to delete users.', life: 3000 });
            return;
        }
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUser(user).subscribe({
                    next: () => {
                        this.users.set(this.users().filter((val) => val.id !== user.id));
                        this.user = {
                            id: '',
                            username: '',
                            email: '',
                            role: 'user',
                            name: '',
                            status: 'pending'
                        };
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Deleted',
                            life: 3000
                        });
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

    findIndexById(user: User): number {
        let index = -1;
        if (!user.id) {
            return index; // Return -1 if user.id is undefined
        }
        for (let i = 0; i < this.users().length; i++) {
            if (this.users()[i].id === user.id) {
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

    getSeverity(status: string) {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'warn';
            case 'pending':
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
        this.submitted = true;
        let _users = this.users();
        if ((this.user.name?.trim() ?? '') !== '' && (this.user.email?.trim() ?? '') !== '' && (this.user.role?.trim() ?? '') !== '' && (this.user.username?.trim() ?? '') !== '') {
            if (this.user.id) {
                this.userService.updateUser(this.user).subscribe({
                    next: () => {
                        const index = this.findIndexById(this.user);
                        if (index !== -1) {
                            _users[index] = this.user;
                            this.users.set([..._users]);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'User Updated',
                                life: 3000
                            });
                        } else {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Warning',
                                detail: 'User not found',
                                life: 3000
                            });
                        }
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
                this.user.id = this.createId();
                this.user.status = 'pending'; // Default status for new users

                // Create new user via service
                const newUser: Omit<User, 'id'> = {
                    username: this.user.username!,
                    email: this.user.email!,
                    role: this.user.role as 'admin' | 'user',
                    name: this.user.name!,
                    status: this.user.status as 'active' | 'inactive' | 'pending'
                };

                this.userService.createUser(newUser).subscribe({
                    next: (createdUser) => {
                        this.users.set([..._users, createdUser]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Created',
                            life: 3000
                        });
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

            this.userDialog = false;
            this.user = {
                id: '',
                username: '',
                email: '',
                role: 'user',
                name: '',
                status: 'pending'
            };
        }
    }
}
