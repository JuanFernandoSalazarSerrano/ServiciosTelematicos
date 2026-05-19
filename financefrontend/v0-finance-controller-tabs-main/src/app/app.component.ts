import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-surface-900 border-b border-surface-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
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
              </div>
              <span class="text-lg font-semibold text-surface-50"
                >James Street API Dashboard</span
              >
            </div>
            <div class="flex items-center gap-2 text-sm text-surface-400">
              <span class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
              Live
            </div>
          </div>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <nav class="bg-surface-900/50 border-b border-surface-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex space-x-1 overflow-x-auto py-2">
            @for (tab of tabs; track tab.route) {
              <a
                [routerLink]="tab.route"
                routerLinkActive="bg-primary-600/20 text-primary-400 border-primary-500"
                [routerLinkActiveOptions]="{ exact: true }"
                class="px-4 py-2 text-sm font-medium text-surface-400 hover:text-surface-200 hover:bg-surface-800 rounded-md transition-all duration-200 border border-transparent whitespace-nowrap"
              >
                {{ tab.label }}
              </a>
            }
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-surface-900 border-t border-surface-700 py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-surface-500">
          Finance API Dashboard &copy; 2026
        </div>
      </footer>
    </div>
  `,
})
export class AppComponent {
  tabs = [
    { route: '/', label: 'Home' },
    { route: '/stocks', label: 'Stocks' },
    { route: '/clients', label: 'Clients' },
    { route: '/portfolios', label: 'Portfolios' },
    { route: '/monitoring', label: 'Monitoring' },
    { route: '/health', label: 'Health' },
    { route: '/failures', label: 'Failures' },
  ];
}
