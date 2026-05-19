import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HomeLink {
  route: string;
  label: string;
  description: string;
  short: string;
  iconBgClass: string;
  iconTextClass: string;
  meta?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <section class="card p-6 relative overflow-hidden">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-surface-900 to-accent-600/10"
        ></div>
        <div class="relative z-10">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 class="text-3xl font-semibold text-surface-50">Finance Dashboard</h1>
              <p class="text-surface-400 mt-2 max-w-2xl">
                Start here and jump to any area of the API dashboard. Use the quick
                links below or the top tabs to explore live data.
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <a routerLink="/stocks" class="btn btn-primary">View Stocks</a>
              <a routerLink="/monitoring" class="btn btn-secondary">System Monitoring</a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-surface-100">Quick Navigation</h2>
          <span class="text-xs text-surface-500">Choose a section to open</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          @for (link of links; track link.route) {
            <a
              [routerLink]="link.route"
              class="card p-5 transition-all duration-200 hover:border-primary-500/60 hover:-translate-y-0.5"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center"
                      [class]="link.iconBgClass"
                    >
                      <span class="text-xs font-semibold" [class]="link.iconTextClass">
                        {{ link.short }}
                      </span>
                    </div>
                    <div>
                      <div class="text-base font-medium text-surface-100">
                        {{ link.label }}
                      </div>
                      <div class="text-sm text-surface-400">
                        {{ link.description }}
                      </div>
                    </div>
                  </div>
                  @if (link.meta) {
                    <div class="text-xs font-mono text-surface-500">{{ link.meta }}</div>
                  }
                </div>
                <div class="text-sm text-surface-500">Go</div>
              </div>
            </a>
          }
        </div>
      </section>

      <section class="card p-6">
        <h2 class="text-lg font-medium text-surface-100">Tips</h2>
        <ul class="list-disc pl-5 mt-3 text-sm text-surface-400 space-y-2">
          <li>Use the Clients list to open a specific client portfolio.</li>
          <li>Monitoring refreshes automatically every 10 seconds.</li>
          <li>Failures lets you test error handling with known responses.</li>
        </ul>
      </section>
    </div>
  `,
})
export class HomeComponent {
  links: HomeLink[] = [
    {
      route: '/stocks',
      label: 'Stocks',
      description: 'Real-time prices, movers, and volume highlights.',
      short: 'STK',
      iconBgClass: 'bg-primary-600/20',
      iconTextClass: 'text-primary-400',
      meta: 'GET /api/stocks',
    },
    {
      route: '/clients',
      label: 'Clients',
      description: 'Manage client accounts and balances.',
      short: 'CL',
      iconBgClass: 'bg-accent-600/20',
      iconTextClass: 'text-accent-400',
      meta: 'GET /api/clients',
    },
    {
      route: '/portfolios',
      label: 'Portfolios',
      description: 'Track investment allocations and day changes.',
      short: 'PF',
      iconBgClass: 'bg-yellow-600/20',
      iconTextClass: 'text-yellow-400',
      meta: 'GET /api/portfolios',
    },
    {
      route: '/monitoring',
      label: 'Monitoring',
      description: 'CPU, memory, and runtime metrics.',
      short: 'MON',
      iconBgClass: 'bg-purple-600/20',
      iconTextClass: 'text-purple-400',
      meta: 'GET /api/metrics',
    },
    {
      route: '/health',
      label: 'Health',
      description: 'Quick health check response.',
      short: 'HLT',
      iconBgClass: 'bg-accent-600/20',
      iconTextClass: 'text-accent-400',
      meta: 'GET /api/health-text',
    },
    {
      route: '/failures',
      label: 'Failures',
      description: 'Trigger known errors for testing.',
      short: 'ERR',
      iconBgClass: 'bg-red-600/20',
      iconTextClass: 'text-red-400',
      meta: 'GET /api/failures/*',
    },
  ];
}
