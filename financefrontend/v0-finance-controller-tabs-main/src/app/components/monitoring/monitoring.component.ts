import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringService, MonitoringResponse } from '../../services/monitoring.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { ErrorDisplayComponent } from '../shared/error-display.component';
import { PageHeaderComponent } from '../shared/page-header.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    PageHeaderComponent,
  ],
  template: `
    <div>
      <app-page-header
        title="Monitoring"
        subtitle="System metrics and performance"
        endpoint="GET /api/metrics"
        iconBgClass="bg-purple-600/20">
        <svg
          icon
          class="w-5 h-5 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
          </path>
        </svg>
      </app-page-header>

      @if (loading) {
        <app-loading-spinner message="Fetching monitoring data..."></app-loading-spinner>
      } @else if (error) {
        <app-error-display title="Failed to load monitoring data" [message]="error"></app-error-display>
      } @else if (data) {
        <div class="card p-6 mb-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                [ngClass]="{
                  'bg-accent-500/20': data.backendStatus === 'UP',
                  'bg-red-500/20': data.backendStatus !== 'UP'
                }">
                <div
                  class="w-4 h-4 rounded-full animate-pulse"
                  [ngClass]="{
                    'bg-accent-500': data.backendStatus === 'UP',
                    'bg-red-500': data.backendStatus !== 'UP'
                  }"></div>
              </div>
              <div>
                <div class="text-xl font-semibold text-surface-100">{{ data.message }}</div>
                <div class="text-sm text-surface-400">Status: {{ data.backendStatus }} | Host: {{ data.hostname }} | Port: {{ data.port }}</div>
              </div>
            </div>
            <div class="text-right text-sm text-surface-400">
              <div>Last updated: {{ formatTimestamp(data.timestamp) }}</div>
              <div class="text-xs">Auto-refresh: 10s</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="metric-card">
            <div class="flex items-center justify-between mb-2">
              <span class="text-surface-400 text-sm">Uptime</span>
              <svg class="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="metric-value">{{ formatUptime(data.uptimeMs) }}</div>
          </div>

          <div class="metric-card">
            <div class="flex items-center justify-between mb-2">
              <span class="text-surface-400 text-sm">Total Requests</span>
              <svg class="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </div>
            <div class="metric-value">{{ data.totalRequestsServed | number }}</div>
          </div>

          <div class="metric-card">
            <div class="flex items-center justify-between mb-2">
              <span class="text-surface-400 text-sm">Active Connections</span>
              <svg class="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </div>
            <div class="metric-value">{{ data.activeConnectionsEstimate }}</div>
          </div>

          <div class="metric-card">
            <div class="flex items-center justify-between mb-2">
              <span class="text-surface-400 text-sm">Thread Count</span>
              <svg class="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"></path>
              </svg>
            </div>
            <div class="metric-value">{{ data.threadCount }}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-surface-100">Memory Usage</h3>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-surface-400">Used</span>
                  <span class="text-surface-200">{{ formatBytes(data.memory.usedBytes) }} / {{ formatBytes(data.memory.maxBytes) }}</span>
                </div>
                <div class="w-full bg-surface-700 rounded-full h-2">
                  <div
                    class="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    [style.width.%]="getMemoryUsagePercent()"></div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="text-surface-400">Total Bytes</div>
                  <div class="font-mono text-surface-200">{{ formatBytes(data.memory.totalBytes) }}</div>
                </div>
                <div>
                  <div class="text-surface-400">Free Bytes</div>
                  <div class="font-mono text-surface-200">{{ formatBytes(data.memory.freeBytes) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-surface-100">CPU Usage</h3>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto rounded-full border-4 border-surface-700 flex items-center justify-center mb-2" [style.border-top-color]="data.cpu.processCpuLoadPercent ? 'rgb(14 165 233)' : 'rgb(63 63 70)'">
                    <span class="text-lg font-semibold text-surface-100">{{ data.cpu.processCpuLoadPercent !== null ? (data.cpu.processCpuLoadPercent | number: '1.0-1') + '%' : 'N/A' }}</span>
                  </div>
                  <div class="text-xs text-surface-400">Process CPU</div>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto rounded-full border-4 border-surface-700 flex items-center justify-center mb-2" [style.border-top-color]="data.cpu.systemCpuLoadPercent ? 'rgb(34 197 94)' : 'rgb(63 63 70)'">
                    <span class="text-lg font-semibold text-surface-100">{{ data.cpu.systemCpuLoadPercent !== null ? (data.cpu.systemCpuLoadPercent | number: '1.0-1') + '%' : 'N/A' }}</span>
                  </div>
                  <div class="text-xs text-surface-400">System CPU</div>
                </div>
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto rounded-full border-4 border-surface-700 flex items-center justify-center mb-2">
                    <span class="text-lg font-semibold text-surface-100">{{ data.cpu.systemLoadAverage !== null ? (data.cpu.systemLoadAverage | number: '1.2-2') : 'N/A' }}</span>
                  </div>
                  <div class="text-xs text-surface-400">Load Average</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class MonitoringComponent implements OnInit, OnDestroy {
  data: MonitoringResponse | null = null;
  loading = true;
  error = '';
  private refreshSubscription?: Subscription;

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit(): void {
    this.loadData();
    this.refreshSubscription = interval(10000).subscribe(() => {
      this.loadData(false);
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadData(showLoading = true): void {
    if (showLoading) {
      this.loading = true;
    }
    this.error = '';
    this.monitoringService.getMetrics().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load monitoring data';
        this.loading = false;
      },
    });
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getMemoryUsagePercent(): number {
    if (!this.data?.memory) return 0;
    return (this.data.memory.usedBytes / this.data.memory.maxBytes) * 100;
  }
}
