import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Ability } from '@casl/ability';
import { AbilityService } from '../../../services/ability.service';
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
import { DropdownModule } from 'primeng/dropdown'; // Changed from SelectModule to DropdownModule
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../../services/auth.service';

// Use the User interface from UserService instead of Admin
type Admin = User;

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
    selector: 'app-admin-manager',
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
    templateUrl: './admin-manager.component.html',
    styleUrl: './admin-manager.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class AdminManagerComponent implements OnInit {
    ability!: Ability;
    adminDialog: boolean = false;
    admins = signal<Admin[]>([]);
    admin!: Admin;
    selectedUsers!: Admin[] | null;
    submitted: boolean = false;
    statuses!: any[];
    canManageUsers: boolean = false; // New property to control UI elements

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private abilityService: AbilityService,
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public authService: AuthService
    ) {}

    ngOnInit(): void {
        this.ability = this.abilityService.getAbility();

        this.ability.on('updated', () => {
            // Only owner can manage admins
            this.canManageUsers = this.authService.currentUserValue?.role === 'owner';
            console.log('Ability updated, canManageUsers:', this.canManageUsers);
        });

        this.canManageUsers = this.authService.currentUserValue?.role === 'owner';

        this.loadAdmins();

        this.statuses = [
            { label: 'ACTIVE', value: 'active' },
            { label: 'INACTIVE', value: 'inactive' },
            { label: 'PENDING', value: 'pending' }
        ];

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'role', header: 'Role' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadAdmins() {
        this.userService.getUsers().subscribe((data) => {
            this.admins.set(data.filter((user) => user.role === 'admin'));
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to add new admins.', life: 3000 });
            return;
        }
        this.admin = {
            id: '',
            username: '',
            email: '',
            role: 'admin',
            name: '',
            status: 'active'
        };
        this.submitted = false;
        this.adminDialog = true;
    }

    editAdmin(admin: Admin) {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to edit admins.', life: 3000 });
            return;
        }
        this.admin = { ...admin };
        this.adminDialog = true;
    }

    deleteSelectedUsers() {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to delete selected admins.', life: 3000 });
            return;
        }
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected admins?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.admins.set(this.admins().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Admins Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.adminDialog = false;
        this.submitted = false;
    }

    deleteAdmin(admin: Admin) {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to delete admins.', life: 3000 });
            return;
        }

        // Prevent admin from deleting themselves
        if (admin.id === this.authService.currentUserValue?.id) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You cannot delete your own account.', life: 3000 });
            return;
        }

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + admin.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUser(admin).subscribe({
                    next: () => {
                        this.admins.set(this.admins().filter((val) => val.id !== admin.id));
                        this.admin = {
                            id: '',
                            username: '',
                            email: '',
                            role: 'admin',
                            name: '',
                            status: 'active'
                        };
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Admin Deleted',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        console.error('Error deleting admin', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete admin',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.admins().length; i++) {
            if (this.admins()[i].id === id) {
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

    saveAdmin() {
        if (!this.canManageUsers) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You are not authorized to save admins.', life: 3000 });
            return;
        }
        this.submitted = true;
        let _admins = this.admins();
        if (this.admin.name?.trim() && this.admin.email?.trim() && this.admin.role?.trim()) {
            if (this.admin.id) {
                _admins[this.findIndexById(this.admin.id)] = this.admin;
                this.admins.set([..._admins]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Admin Updated',
                    life: 3000
                });
            } else {
                this.admin.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Admin Created',
                    life: 3000
                });
                this.admins.set([..._admins, this.admin]);
            }

            this.adminDialog = false;
            this.admin = {
                id: '',
                username: '',
                email: '',
                role: 'admin',
                name: '',
                status: 'active'
            };
        }
    }
}
