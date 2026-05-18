import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  template: `
    <div class="metric-card">
      <div class="flex items-start justify-between">
        <div>
          <div class="metric-value" [class]="valueClass">{{ value }}</div>
          <div class="metric-label">{{ label }}</div>
        </div>
        @if (icon) {
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            [class]="iconBgClass"
          >
            <ng-content select="[icon]"></ng-content>
          </div>
        }
      </div>
      @if (change !== null && change !== undefined) {
        <div class="mt-3 flex items-center gap-1 text-xs">
          @if (change >= 0) {
            <svg
              class="w-3 h-3 text-accent-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span class="text-accent-400">+{{ change }}%</span>
          } @else {
            <svg
              class="w-3 h-3 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span class="text-red-400">{{ change }}%</span>
          }
        </div>
      }
    </div>
  `,
})
export class MetricCardComponent {
  @Input() value: string | number = '';
  @Input() label = '';
  @Input() icon = false;
  @Input() iconBgClass = 'bg-primary-600/20';
  @Input() valueClass = '';
  @Input() change: number | null = null;
}
