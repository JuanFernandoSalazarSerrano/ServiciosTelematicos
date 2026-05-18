import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          [class]="iconBgClass"
        >
          <ng-content select="[icon]"></ng-content>
        </div>
        <div>
          <h1 class="text-2xl font-semibold text-surface-50">{{ title }}</h1>
          @if (subtitle) {
            <p class="text-sm text-surface-400">{{ subtitle }}</p>
          }
        </div>
      </div>
      @if (endpoint) {
        <div class="mt-4 flex items-center gap-2">
          <span class="text-xs text-surface-500 uppercase tracking-wider"
            >Endpoint:</span
          >
          <code
            class="px-2 py-1 bg-surface-800 rounded text-xs font-mono text-primary-400"
            >{{ endpoint }}</code
          >
        </div>
      }
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() endpoint = '';
  @Input() iconBgClass = 'bg-primary-600/20';
}
