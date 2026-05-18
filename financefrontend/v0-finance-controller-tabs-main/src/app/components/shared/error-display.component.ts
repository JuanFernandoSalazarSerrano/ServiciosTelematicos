import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-display',
  standalone: true,
  template: `
    <div class="card p-6 text-center">
      <div
        class="w-12 h-12 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4"
      >
        <svg
          class="w-6 h-6 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-surface-200 mb-2">{{ title }}</h3>
      <p class="text-surface-400">{{ message }}</p>
    </div>
  `,
})
export class ErrorDisplayComponent {
  @Input() title = 'Error';
  @Input() message = 'An error occurred while loading data.';
}
