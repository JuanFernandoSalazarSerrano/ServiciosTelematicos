import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ClientHolding,
  ClientPortfolioService,
  ClientSummary,
} from '../../services/client-portfolio.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { ErrorDisplayComponent } from '../shared/error-display.component';
import { PageHeaderComponent } from '../shared/page-header.component';
import { DataTableComponent } from '../shared/data-table.component';

@Component({
  selector: 'app-client-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    PageHeaderComponent,
    DataTableComponent,
  ],
  template: `
    <div>
      <app-page-header
        title="Client Portfolio"
        [subtitle]="client ? 'Portfolio for ' + client.name : 'Client-specific holdings'"
        endpoint="GET /api/portfolios/client/:clientId"
        iconBgClass="bg-accent-600/20"
      >
        <svg
          icon
          class="w-5 h-5 text-accent-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7h18M3 12h18M3 17h18M5 7v10M19 7v10"
          />
        </svg>
      </app-page-header>

      <div class="flex items-center justify-between mb-6">
        <div class="text-sm text-surface-400">
          <span class="text-surface-200 font-medium">Client ID:</span>
          <span class="font-mono">#{{ clientId }}</span>
        </div>
        <a routerLink="/clients" class="btn btn-secondary">Back to Clients</a>
      </div>

      @if (loading) {
        <app-loading-spinner message="Fetching client portfolio..."></app-loading-spinner>
      } @else if (error) {
        <app-error-display
          title="Failed to load client portfolio"
          [message]="error"
        ></app-error-display>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="metric-card">
            <div class="metric-value">{{ holdings.length }}</div>
            <div class="metric-label">Holdings</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ formatCurrency(totalValue) }}</div>
            <div class="metric-label">Total Value</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ formatCurrency(totalCost) }}</div>
            <div class="metric-label">Cost Basis</div>
          </div>
          <div class="metric-card">
            <div
              class="metric-value"
              [class.text-accent-400]="totalGainLoss >= 0"
              [class.text-red-400]="totalGainLoss < 0"
            >
              {{ totalGainLoss >= 0 ? '+' : '' }}{{ formatCurrency(totalGainLoss) }}
            </div>
            <div class="metric-label">Unrealized P/L</div>
            @if (totalGainLossPercent !== null) {
              <div class="text-xs text-surface-400 mt-1">
                {{ formatPercent(totalGainLossPercent) }}
              </div>
            }
          </div>
        </div>

        @if (client) {
          <div class="card mb-8">
            <div class="card-header flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-surface-100">
                  Client Profile
                </h3>
                <p class="text-sm text-surface-400">
                  {{ client.email || 'No email on file' }}
                </p>
              </div>
              @if (client.status) {
                <span
                  class="status-badge"
                  [class.status-up]="client.status === 'Active'"
                  [class.status-down]="client.status === 'Inactive'"
                  [class.status-warning]="client.status === 'Pending'"
                >
                  {{ client.status }}
                </span>
              }
            </div>
            <div class="card-body grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div class="text-xs text-surface-500 uppercase tracking-wider">
                  Name
                </div>
                <div class="text-surface-200">{{ client.name }}</div>
              </div>
              <div>
                <div class="text-xs text-surface-500 uppercase tracking-wider">
                  Phone
                </div>
                <div class="text-surface-200">{{ client.phone || '-' }}</div>
              </div>
              <div>
                <div class="text-xs text-surface-500 uppercase tracking-wider">
                  City
                </div>
                <div class="text-surface-200">{{ client.city || '-' }}</div>
              </div>
              <div>
                <div class="text-xs text-surface-500 uppercase tracking-wider">
                  Account Type
                </div>
                <div class="text-surface-200">{{ client.accountType || '-' }}</div>
              </div>
              <div>
                <div class="text-xs text-surface-500 uppercase tracking-wider">
                  Balance
                </div>
                <div class="text-surface-200">
                  {{ formatCurrency(client.balance || 0) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-surface-500 uppercase tracking-wider">
                  Created
                </div>
                <div class="text-surface-200">{{ formatDate(client.createdAt) }}</div>
              </div>
            </div>
          </div>
        } @else {
          <div class="card p-6 mb-8 text-surface-400">
            Client profile details are not available.
          </div>
        }

        <app-data-table title="Portfolio Holdings" [count]="holdings.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Company</th>
                <th class="text-right">Shares</th>
                <th class="text-right">Purchase</th>
                <th class="text-right">Current</th>
                <th class="text-right">Value</th>
                <th class="text-right">Gain/Loss</th>
                <th>Purchased</th>
              </tr>
            </thead>
            <tbody>
              @for (holding of holdings; track holding.portfolioId) {
                <tr>
                  <td class="font-mono font-medium text-primary-400">
                    {{ holding.symbol }}
                  </td>
                  <td class="text-surface-200">{{ holding.companyName }}</td>
                  <td class="text-right font-mono text-surface-300">
                    {{ holding.sharesOwned }}
                  </td>
                  <td class="text-right font-mono">
                    {{ formatCurrency(holding.purchasePrice) }}
                  </td>
                  <td class="text-right font-mono">
                    {{ holding.currentPrice ? formatCurrency(holding.currentPrice) : '-' }}
                  </td>
                  <td class="text-right font-mono text-surface-200">
                    {{ formatCurrency(holding.positionValue) }}
                  </td>
                  <td
                    class="text-right font-mono"
                    [class.text-accent-400]="holding.gainLoss >= 0"
                    [class.text-red-400]="holding.gainLoss < 0"
                  >
                    {{ holding.gainLoss >= 0 ? '+' : '' }}{{
                      formatCurrency(holding.gainLoss)
                    }}
                    @if (holding.gainLossPercent !== null) {
                      <span class="text-xs text-surface-400 ml-1">
                        ({{ formatPercent(holding.gainLossPercent) }})
                      </span>
                    }
                  </td>
                  <td class="text-surface-400 text-sm">
                    {{ formatDate(holding.purchaseDate) }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="text-center py-8 text-surface-400">
                    No portfolio holdings available
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
export class ClientPortfolioComponent implements OnInit {
  clientId = 0;
  client: ClientSummary | null = null;
  holdings: ClientHolding[] = [];
  totalValue = 0;
  totalCost = 0;
  totalGainLoss = 0;
  totalGainLossPercent: number | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private clientPortfolioService: ClientPortfolioService
  ) {}

  ngOnInit(): void {
    const clientIdParam = this.route.snapshot.paramMap.get('clientId');
    const parsedId = Number(clientIdParam);

    if (!clientIdParam || Number.isNaN(parsedId)) {
      this.error = 'Invalid client id.';
      this.loading = false;
      return;
    }

    this.clientId = parsedId;
    this.loadClientPortfolio(parsedId);
  }

  loadClientPortfolio(clientId: number): void {
    this.loading = true;
    this.error = '';
    this.clientPortfolioService.getClientPortfolio(clientId).subscribe({
      next: (data) => {
        this.client = data.client;
        this.holdings = data.holdings;
        this.updateTotals();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load client portfolio.';
        this.loading = false;
      },
    });
  }

  updateTotals(): void {
    const totalValue = this.holdings.reduce(
      (sum, holding) => sum + (holding.positionValue || 0),
      0
    );
    const totalCost = this.holdings.reduce(
      (sum, holding) => sum + holding.sharesOwned * (holding.purchasePrice || 0),
      0
    );

    this.totalValue = totalValue;
    this.totalCost = totalCost;
    this.totalGainLoss = totalValue - totalCost;
    this.totalGainLossPercent = totalCost
      ? (this.totalGainLoss / totalCost) * 100
      : null;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  }

  formatPercent(value: number | null): string {
    if (value === null || Number.isNaN(value)) return '-';
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value.toFixed(2)}%`;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
