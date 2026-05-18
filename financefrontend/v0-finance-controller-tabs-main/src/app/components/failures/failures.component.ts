import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FailureService, FailureResult } from '../../services/failure.service';
import { PageHeaderComponent } from '../shared/page-header.component';

interface FailureEndpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  params?: { name: string; default: string }[];
}

@Component({
  selector: 'app-failures',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  template: `
    <div>
      <app-page-header
        title="Failure Testing"
        subtitle="Test error handling and failure scenarios"
        endpoint="GET /api/failures/*"
        iconBgClass="bg-red-600/20">
        <svg
          icon
          class="w-5 h-5 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
          </path>
        </svg>
      </app-page-header>

      <div class="mb-6 card p-4">
        <div class="flex items-center gap-3 text-yellow-400">
          <svg
            class="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
          <span class="text-sm">These endpoints are designed for testing error handling. They will intentionally fail with specific error codes.</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        @for (endpoint of endpoints; track endpoint.path) {
          <div class="card">
            <div class="card-header">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs font-mono rounded">{{ endpoint.method }}</span>
                  <span class="font-mono text-sm text-surface-200">{{ endpoint.path }}</span>
                </div>
              </div>
            </div>
            <div class="card-body">
              <p class="text-sm text-surface-400 mb-4">{{ endpoint.description }}</p>

              @if (endpoint.params) {
                <div class="space-y-3 mb-4">
                  @for (param of endpoint.params; track param.name) {
                    <div>
                      <label class="block text-xs text-surface-500 uppercase tracking-wider mb-1">{{ param.name }}</label>
                      <input
                        type="text"
                        class="w-full bg-surface-800 border border-surface-600 rounded-md px-3 py-2 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        [placeholder]="param.default"
                        [(ngModel)]="paramValues[endpoint.path + '-' + param.name]" />
                    </div>
                  }
                </div>
              }

              <button
                class="btn w-full"
                [class.btn-secondary]="!isTriggering[endpoint.path]"
                [class.bg-surface-600]="isTriggering[endpoint.path]"
                [disabled]="isTriggering[endpoint.path]"
                (click)="triggerEndpoint(endpoint)">
                @if (isTriggering[endpoint.path]) {
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Triggering...
                } @else {
                  Trigger {{ endpoint.name }}
                }
              </button>
            </div>
          </div>
        }
      </div>

      <div class="card">
        <div class="card-header flex items-center justify-between">
          <h3 class="text-lg font-medium text-surface-100">Response Log</h3>
          @if (results.length > 0) {
            <button class="text-sm text-surface-400 hover:text-surface-200" (click)="clearResults()">Clear Log</button>
          }
        </div>
        <div class="card-body">
          @if (results.length === 0) {
            <div class="text-center py-8 text-surface-500">No responses yet. Trigger an endpoint to see results.</div>
          } @else {
            <div class="space-y-3">
              @for (result of results; track $index) {
                <div
                  class="bg-surface-800 rounded-lg p-4 border-l-4"
                  [class.border-red-500]="result.status === 'Error'"
                  [class.border-accent-500]="result.status !== 'Error'">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span
                        class="font-mono text-sm"
                        [class.text-red-400]="result.status === 'Error'"
                        [class.text-accent-400]="result.status !== 'Error'">{{ result.endpoint }}</span>
                      <span
                        class="px-2 py-0.5 rounded text-xs"
                        [class.bg-red-500]="result.status === 'Error'"
                        [class.text-white]="result.status === 'Error'"
                        [class.bg-accent-500]="result.status !== 'Error'"
                        [class.text-surface-900]="result.status !== 'Error'">{{ result.status }}</span>
                    </div>
                    <span class="text-xs text-surface-500">{{ result.timestamp | date: 'HH:mm:ss' }}</span>
                  </div>
                  <p class="text-sm text-surface-300 font-mono">{{ result.message }}</p>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class FailuresComponent {
  endpoints: FailureEndpoint[] = [
    {
      name: 'Bad Request',
      method: 'GET',
      path: '/bad-request',
      description: 'Triggers a 400 Bad Request error response.',
      params: [{ name: 'message', default: 'Bad request for testing' }],
    },
    {
      name: 'Not Found',
      method: 'GET',
      path: '/not-found',
      description: 'Triggers a 404 Not Found error response.',
      params: [{ name: 'message', default: 'Resource not found for testing' }],
    },
    {
      name: 'Server Error',
      method: 'GET',
      path: '/server-error',
      description: 'Triggers a 500 Internal Server Error response.',
      params: [{ name: 'message', default: 'Server error for testing' }],
    },
    {
      name: 'Unavailable',
      method: 'GET',
      path: '/unavailable',
      description: 'Triggers a 503 Service Unavailable error response.',
      params: [{ name: 'message', default: 'Service unavailable for testing' }],
    },
    {
      name: 'Timeout',
      method: 'GET',
      path: '/timeout',
      description: 'Simulates a delayed response. Waits for specified seconds before responding.',
      params: [{ name: 'seconds', default: '5' }],
    },
  ];

  results: FailureResult[] = [];
  isTriggering: Record<string, boolean> = {};
  paramValues: Record<string, string> = {};

  constructor(private failureService: FailureService) {}

  triggerEndpoint(endpoint: FailureEndpoint): void {
    this.isTriggering[endpoint.path] = true;

    let observable;
    const messageKey = endpoint.path + '-message';
    const secondsKey = endpoint.path + '-seconds';

    switch (endpoint.path) {
      case '/bad-request':
        observable = this.failureService.triggerBadRequest(this.paramValues[messageKey]);
        break;
      case '/not-found':
        observable = this.failureService.triggerNotFound(this.paramValues[messageKey]);
        break;
      case '/server-error':
        observable = this.failureService.triggerServerError(this.paramValues[messageKey]);
        break;
      case '/unavailable':
        observable = this.failureService.triggerUnavailable(this.paramValues[messageKey]);
        break;
      case '/timeout':
        const seconds = parseInt(this.paramValues[secondsKey] || '5', 10);
        observable = this.failureService.triggerTimeout(seconds);
        break;
      default:
        return;
    }

    observable.subscribe({
      next: (result) => {
        this.results.unshift(result);
        this.isTriggering[endpoint.path] = false;
      },
      error: () => {
        this.isTriggering[endpoint.path] = false;
      },
    });
  }

  clearResults(): void {
    this.results = [];
  }
}
