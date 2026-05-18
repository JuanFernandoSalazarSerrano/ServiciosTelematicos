import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientService, Client } from '../../services/client.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { ErrorDisplayComponent } from '../shared/error-display.component';
import { PageHeaderComponent } from '../shared/page-header.component';
import { DataTableComponent } from '../shared/data-table.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    PageHeaderComponent,
    DataTableComponent,
  ],
  template: `
    <div>
      <app-page-header
        title="Clients"
        subtitle="Client management and accounts"
        endpoint="GET /api/clients"
        iconBgClass="bg-accent-600/20">
        <svg
          icon
          class="w-5 h-5 text-accent-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
          </path>
        </svg>
      </app-page-header>

      @if (loading) {
        <app-loading-spinner message="Fetching client data..."></app-loading-spinner>
      } @else if (error) {
        <app-error-display title="Failed to load clients" [message]="error"></app-error-display>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="metric-card">
            <div class="metric-value">{{ clients.length }}</div>
            <div class="metric-label">Total Clients</div>
          </div>
          <div class="metric-card">
            <div class="metric-value text-accent-400">{{ getActiveCount() }}</div>
            <div class="metric-label">Active</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ getTotalBalance() }}</div>
            <div class="metric-label">Total Balance</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ getAccountTypes() }}</div>
            <div class="metric-label">Account Types</div>
          </div>
        </div>

        <app-data-table title="Client List" [count]="clients.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account Type</th>
                <th>Status</th>
                <th class="text-right">Balance</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              @for (client of clients; track client.id) {
                <tr
                  class="cursor-pointer"
                  role="link"
                  tabindex="0"
                  (click)="goToClientPortfolio(client)"
                  (keyup.enter)="goToClientPortfolio(client)">
                  <td class="font-mono text-surface-400">#{{ client.id }}</td>
                  <td class="font-medium text-surface-200">{{ client.name }}</td>
                  <td class="text-surface-300">{{ client.email }}</td>
                  <td class="font-mono text-surface-400">{{ client.phone }}</td>
                  <td>
                    <span
                      class="px-2 py-1 rounded text-xs"
                      [ngClass]="{
                        'bg-primary-600/20 text-primary-400': client.accountType === 'Premium',
                        'bg-surface-700 text-surface-300': client.accountType !== 'Premium'
                      }">{{ client.accountType }}</span>
                  </td>
                  <td>
                    <span
                      class="status-badge"
                      [ngClass]="{
                        'status-up': client.status === 'Active',
                        'status-down': client.status === 'Inactive',
                        'status-warning': client.status === 'Pending'
                      }">{{ client.status }}</span>
                  </td>
                  <td class="text-right font-mono text-surface-200">{{ formatCurrency(client.balance) }}</td>
                  <td class="text-surface-400 text-sm">{{ formatDate(client.createdAt) }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="text-center py-8 text-surface-400">No clients available</td>
                </tr>
              }
            </tbody>
          </table>
        </app-data-table>
      }
    </div>
  `,
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  error = '';

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.error = '';
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load clients';
        this.loading = false;
      },
    });
  }

  getActiveCount(): number {
    return this.clients.filter((c) => c.status === 'Active').length;
  }

  getTotalBalance(): string {
    const total = this.clients.reduce((sum, c) => sum + (c.balance || 0), 0);
    return this.formatCurrency(total);
  }

  getAccountTypes(): number {
    return new Set(this.clients.map((c) => c.accountType)).size;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  goToClientPortfolio(client: Client): void {
    if (!client?.id) {
      console.warn('Client id is missing for navigation.', client);
      return;
    }
    this.router.navigate(['/clients', client.id, 'portfolio']);
  }
}
