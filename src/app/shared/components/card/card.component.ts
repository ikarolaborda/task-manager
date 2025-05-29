import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <div *ngIf="title || subtitle" class="mb-4">
        <h3 *ngIf="title" class="text-lg font-semibold text-secondary-900">
          {{ title }}
        </h3>
        <p *ngIf="subtitle" class="text-sm text-secondary-600 mt-1">
          {{ subtitle }}
        </p>
      </div>
      
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="hasFooter" class="mt-4 pt-4 border-t border-secondary-200">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' = 'sm';
  @Input() hover = false;
  
  hasFooter = false;
  
  ngAfterContentInit() {
    // Check if footer content is projected
    this.hasFooter = document.querySelector('[slot=footer]') !== null;
  }
  
  get cardClasses(): string {
    const baseClasses = 'bg-white rounded-xl border border-secondary-200 transition-shadow duration-200';
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };
    
    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };
    
    const hoverClasses = this.hover ? 'hover:shadow-md' : '';
    
    return `${baseClasses} ${paddingClasses[this.padding]} ${shadowClasses[this.shadow]} ${hoverClasses}`.trim();
  }
} 