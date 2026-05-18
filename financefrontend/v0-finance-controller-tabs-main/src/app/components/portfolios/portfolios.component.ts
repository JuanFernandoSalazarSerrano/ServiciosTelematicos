import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, Portfolio } from '../../services/portfolio.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { ErrorDisplayComponent } from '../shared/error-display.component';
import { PageHeaderComponent } from '../shared/page-header.component';
import { DataTableComponent } from '../shared/data-table.component';

@Component({
  selector: 'app-portfolios',
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
        title="Portfolios"
        subtitle="Investment portfolio management"
        endpoint="GET /api/portfolios"
        iconBgClass="bg-yellow-600/20"
      >
        <svg
          icon
          class="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </app-page-header>

      @if (loading) {
        <app-loading-spinner message="Fetching portfolio data..."></app-loading-spinner>
      } @else if (error) {
        <app-error-display
          title="Failed to load portfolios"
          [message]="error"
        ></app-error-display>
      } @else {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="metric-card">
            <div class="metric-value">{{ portfolios.length }}</div>
            <div class="metric-label">Total Portfolios</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ getTotalValue() }}</div>
            <div class="metric-label">Total Value</div>
          </div>
          <div class="metric-card">
            <div class="metric-value" [class.text-accent-400]="getDayChange() >= 0" [class.text-red-400]="getDayChange() < 0">
              {{ getDayChange() >= 0 ? '+' : '' }}{{ getDayChangeFormatted() }}
            </div>
            <div class="metric-label">Day Change</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ getTotalHoldings() }}</div>
            <div class="metric-label">Total Holdings</div>
          </div>
        </div>

        <!-- Data Table -->
        <app-data-table title="Portfolio List" [count]="portfolios.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Client ID</th>
                <th class="text-right">Total Value</th>
                <th class="text-right">Day Change</th>
                <th class="text-right">Change %</th>
                <th class="text-right">Holdings</th>
                <th>Risk Level</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              @for (portfolio of portfolios; track portfolio.id) {
                <tr>
                  <td class="font-mono text-surface-400">#{{ portfolio.id }}</td>
                  <td class="font-medium text-surface-200">{{ portfolio.name }}</td>
                  <td class="font-mono text-surface-400">#{{ portfolio.clientId }}</td>
                  <td class="text-right font-mono text-surface-200">
                    {{ formatCurrency(portfolio.totalValue) }}
                  </td>
                  <td
                    class="text-right font-mono"
                    [class.text-accent-400]="portfolio.dayChange >= 0"
                    [class.text-red-400]="portfolio.dayChange < 0"
                  >
                    {{ portfolio.dayChange >= 0 ? '+' : '' }}{{ formatCurrency(portfolio.dayChange) }}
                  </td>
                  <td
                    class="text-right font-mono"
                    [class.text-accent-400]="portfolio.dayChangePercent >= 0"
                    [class.text-red-400]="portfolio.dayChangePercent < 0"
                  >
                    {{ portfolio.dayChangePercent >= 0 ? '+' : '' }}{{ portfolio.dayChangePercent | number: '1.2-2' }}%
                  </td>
                  <td class="text-right font-mono text-surface-300">
                    {{ portfolio.holdings }}
                  </td>
                  <td>
                    <span
                      class="status-badge"
                      [class.status-up]="portfolio.riskLevel === 'Low'"
                      [class.status-warning]="portfolio.riskLevel === 'Medium'"
                      [class.status-down]="portfolio.riskLevel === 'High'"
                    >
                      {{ portfolio.riskLevel }}
                    </span>
                  </td>
                  <td class="text-surface-400 text-sm">
                    {{ formatDate(portfolio.createdAt) }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="9" class="text-center py-8 text-surface-400">
                    No portfolios available
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </app-data-table>
      }
    </div>
  `,
})
export class PortfoliosComponent implements OnInit {
  portfolios: Portfolio[] = [];
  loading = true;
  error = '';

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.loading = true;
    this.error = '';
    this.portfolioService.getAllPortfolios().subscribe({
      next: (data) => {
        this.portfolios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load portfolios';
        this.loading = false;
      },
    });
  }

  getTotalValue(): string {
    const total = this.portfolios.reduce((sum, p) => sum + (p.totalValue || 0), 0);
    return this.formatCurrency(total);
  }

  getDayChange(): number {
    return this.portfolios.reduce((sum, p) => sum + (p.dayChange || 0), 0);
  }

  getDayChangeFormatted(): string {
    return this.formatCurrency(this.getDayChange());
  }

  getTotalHoldings(): number {
    return this.portfolios.reduce((sum, p) => sum + (p.holdings || 0), 0);
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
}
