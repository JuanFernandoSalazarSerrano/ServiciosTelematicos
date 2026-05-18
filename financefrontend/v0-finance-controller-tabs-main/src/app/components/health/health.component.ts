import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService, HealthResponse } from '../../services/health.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { ErrorDisplayComponent } from '../shared/error-display.component';
import { PageHeaderComponent } from '../shared/page-header.component';

@Component({
  selector: 'app-health',
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
        title="Health Check"
        subtitle="Simple health status endpoint"
        endpoint="GET /api/health-text"
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </app-page-header>

      @if (loading) {
        <app-loading-spinner message="Checking health status..."></app-loading-spinner>
      } @else if (error) {
        <app-error-display
          title="Health check failed"
          [message]="error"
        ></app-error-display>
      } @else if (data) {
        <div class="max-w-2xl mx-auto">
          <!-- Health Status Card -->
          <div class="card overflow-hidden">
            <div class="bg-accent-600/10 border-b border-accent-600/20 px-6 py-8">
              <div class="flex flex-col items-center text-center">
                <div
                  class="w-20 h-20 rounded-full bg-accent-500/20 flex items-center justify-center mb-4"
                >
                  <svg
                    class="w-10 h-10 text-accent-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 class="text-2xl font-semibold text-surface-50 mb-2">
                  System Healthy
                </h2>
                <p class="text-surface-400">All services are operational</p>
              </div>
            </div>
            <div class="card-body">
              <div class="space-y-4">
                <div>
                  <label class="block text-xs text-surface-500 uppercase tracking-wider mb-2"
                    >Response Message</label
                  >
                  <div
                    class="px-4 py-3 bg-surface-800 rounded-lg font-mono text-sm text-surface-200"
                  >
                    {{ data.message }}
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-surface-500 uppercase tracking-wider mb-2"
                      >Endpoint</label
                    >
                    <div
                      class="px-4 py-3 bg-surface-800 rounded-lg font-mono text-sm text-primary-400"
                    >
                      /api/health-text
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs text-surface-500 uppercase tracking-wider mb-2"
                      >Method</label
                    >
                    <div
                      class="px-4 py-3 bg-surface-800 rounded-lg font-mono text-sm text-accent-400"
                    >
                      GET
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-xs text-surface-500 uppercase tracking-wider mb-2"
                    >Checked At</label
                  >
                  <div
                    class="px-4 py-3 bg-surface-800 rounded-lg font-mono text-sm text-surface-300"
                  >
                    {{ checkedAt | date: 'medium' }}
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t border-surface-700">
                <button
                  (click)="refresh()"
                  class="btn btn-primary w-full"
                  [disabled]="loading"
                >
                  @if (loading) {
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Checking...
                  } @else {
                    Refresh Health Check
                  }
                </button>
              </div>
            </div>
          </div>

          <!-- Controller Info -->
          <div class="card mt-6">
            <div class="card-header">
              <h3 class="text-lg font-medium text-surface-100">Controller Info</h3>
            </div>
            <div class="card-body">
              <p class="text-sm text-surface-400 mb-4">
                The HealthController provides a simple health check endpoint that
                returns the current server port.
              </p>
              <div class="bg-surface-800 rounded-lg p-4 font-mono text-sm">
                <div class="text-surface-500">// HealthController.java</div>
                <div class="mt-2 text-surface-300">
                  <span class="text-primary-400">&#64;GetMapping</span>
                </div>
                <div class="text-surface-300">
                  public ResponseEntity&lt;<span class="text-yellow-400"
                    >Map&lt;String, String&gt;</span
                  >&gt; getHealth() &#123;
                </div>
                <div class="text-surface-300 pl-4">
                  return ResponseEntity.ok(
                  <span class="text-accent-400"
                    >Map.of("message", "health good - port: " + port)</span
                  >);
                </div>
                <div class="text-surface-300">&#125;</div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class HealthComponent implements OnInit {
  data: HealthResponse | null = null;
  loading = true;
  error = '';
  checkedAt = new Date();

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.loadHealth();
  }

  loadHealth(): void {
    this.loading = true;
    this.error = '';
    this.healthService.getHealth().subscribe({
      next: (data) => {
        this.data = data;
        this.checkedAt = new Date();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to check health';
        this.loading = false;
      },
    });
  }

  refresh(): void {
    this.loadHealth();
  }
}
