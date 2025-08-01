import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../shared/services/utils.service';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ChartModule, ButtonModule, RippleModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class Dashboard implements OnInit {
    private userService = inject(UserService);
    utilsService = inject(UtilsService);
    private loadingService = inject(LoadingService);

    currentUser: any;
    stats = {
        totalUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
        inactiveUsers: 0
    };
    recentUsers: any[] = [];
    chartData: any;
    chartOptions: any;
    pieData: any;
    pieOptions: any;

    ngOnInit() {
        this.loadDashboardData();
        this.initializeCharts();
    }

    loadDashboardData() {
        this.userService.getUsers().subscribe((users) => {
            this.stats.totalUsers = users.length;
            this.stats.activeUsers = users.filter((u) => u.status === 'active').length;
            this.stats.pendingUsers = users.filter((u) => u.status === 'pending').length;
            this.stats.inactiveUsers = users.filter((u) => u.status === 'inactive').length;

            this.recentUsers = users
                .sort((a, b) => {
                    const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
                    const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
                    return dateB - dateA;
                })
                .slice(0, 5);

            this.updatePieData(); // Thêm dòng này để cập nhật lại pieData
        });
    }

    initializeCharts() {
        // Line chart for user activity
        this.chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Active Users',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#3B82F6',
                    tension: 0.4
                },
                {
                    label: 'New Users',
                    data: [28, 48, 40, 19, 86, 27],
                    borderColor: '#10B981',
                    tension: 0.4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        this.updatePieData(); // Đảm bảo pieData được khởi tạo lần đầu
    }

    updatePieData() {
        this.pieData = {
            labels: ['Active', 'Inactive', 'Pending'],
            datasets: [
                {
                    data: [this.stats.activeUsers, this.stats.inactiveUsers, this.stats.pendingUsers],
                    backgroundColor: ['#10B981', '#EF4444', '#F59E0B']
                }
            ]
        };
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getRoleClass(role: string): string {
        switch (role) {
            case 'owner':
                return 'bg-orange-100 text-orange-800';
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'user':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    formatDate(date: string | Date): string {
        return this.utilsService.formatDate(date);
    }

    getInitials(name: string): string {
        return this.utilsService.getInitials(name);
    }
}
