import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  template: `
    <div class="card overflow-hidden">
      @if (title) {
        <div class="card-header flex items-center justify-between">
          <h3 class="text-lg font-medium text-surface-100">{{ title }}</h3>
          @if (count !== null) {
            <span class="text-sm text-surface-400">{{ count }} items</span>
          }
        </div>
      }
      <div class="overflow-x-auto">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class DataTableComponent {
  @Input() title = '';
  @Input() count: number | null = null;
}
