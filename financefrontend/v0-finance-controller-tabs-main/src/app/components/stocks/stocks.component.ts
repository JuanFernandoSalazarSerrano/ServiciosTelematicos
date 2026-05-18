import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService, Stock } from '../../services/stock.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { ErrorDisplayComponent } from '../shared/error-display.component';
import { PageHeaderComponent } from '../shared/page-header.component';
import { DataTableComponent } from '../shared/data-table.component';

@Component({
  selector: 'app-stocks',
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
        title="Stocks"
        subtitle="Real-time stock market data"
        endpoint="GET /api/stocks"
        iconBgClass="bg-primary-600/20"
      >
        <svg
          icon
          class="w-5 h-5 text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </app-page-header>

      @if (loading) {
        <app-loading-spinner message="Fetching stock data..."></app-loading-spinner>
      } @else if (error) {
        <app-error-display
          title="Failed to load stocks"
          [message]="error"
        ></app-error-display>
      } @else {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="metric-card">
            <div class="metric-value">{{ stocks.length }}</div>
            <div class="metric-label">Total Stocks</div>
          </div>
          <div class="metric-card">
            <div class="metric-value text-accent-400">
              {{ getPositiveCount() }}
            </div>
            <div class="metric-label">Gainers</div>
          </div>
          <div class="metric-card">
            <div class="metric-value text-red-400">{{ getNegativeCount() }}</div>
            <div class="metric-label">Losers</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ getTotalVolume() }}</div>
            <div class="metric-label">Total Volume</div>
          </div>
        </div>

        <!-- Data Table -->
        <app-data-table title="Stock List" [count]="stocks.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th class="text-right">Price</th>
                <th class="text-right">Change</th>
                <th class="text-right">Change %</th>
                <th class="text-right">Volume</th>
                <th class="text-right">Market Cap</th>
                <th>Sector</th>
              </tr>
            </thead>
            <tbody>
              @for (stock of stocks; track stock.id) {
                <tr>
                  <td class="font-mono font-medium text-primary-400">
                    {{ stock.symbol }}
                  </td>
                  <td class="text-surface-200">{{ stock.name }}</td>
                  <td class="text-right font-mono">
                    {{ formatCurrency(stock.price) }}
                  </td>
                  <td
                    class="text-right font-mono"
                    [class.text-accent-400]="stock.change >= 0"
                    [class.text-red-400]="stock.change < 0"
                  >
                    {{ stock.change >= 0 ? '+' : '' }}{{ stock.change | number: '1.2-2' }}
                  </td>
                  <td
                    class="text-right font-mono"
                    [class.text-accent-400]="stock.changePercent >= 0"
                    [class.text-red-400]="stock.changePercent < 0"
                  >
                    {{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent | number: '1.2-2' }}%
                  </td>
                  <td class="text-right font-mono text-surface-300">
                    {{ formatNumber(stock.volume) }}
                  </td>
                  <td class="text-right font-mono text-surface-300">
                    {{ formatMarketCap(stock.marketCap) }}
                  </td>
                  <td>
                    <span
                      class="px-2 py-1 bg-surface-700 rounded text-xs text-surface-300"
                    >
                      {{ stock.sector }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="text-center py-8 text-surface-400">
                    No stocks available
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
export class StocksComponent implements OnInit {
  stocks: Stock[] = [];
  loading = true;
  error = '';

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.loading = true;
    this.error = '';
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load stocks';
        this.loading = false;
      },
    });
  }

  getPositiveCount(): number {
    return this.stocks.filter((s) => s.change >= 0).length;
  }

  getNegativeCount(): number {
    return this.stocks.filter((s) => s.change < 0).length;
  }

  getTotalVolume(): string {
    const total = this.stocks.reduce((sum, s) => sum + (s.volume || 0), 0);
    return this.formatNumber(total);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  }

  formatNumber(value: number): string {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value?.toString() || '0';
  }

  formatMarketCap(value: number): string {
    if (!value) return '-';
    if (value >= 1000000000000) {
      return '$' + (value / 1000000000000).toFixed(1) + 'T';
    }
    if (value >= 1000000000) {
      return '$' + (value / 1000000000).toFixed(1) + 'B';
    }
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(1) + 'M';
    }
    return '$' + value.toFixed(0);
  }
}
