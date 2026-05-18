import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-12">
      <div class="relative">
        <div
          class="w-12 h-12 rounded-full border-4 border-surface-700 border-t-primary-500 animate-spin"
        ></div>
      </div>
      @if (message) {
        <span class="ml-4 text-surface-400">{{ message }}</span>
      }
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() message = 'Loading...';
}
