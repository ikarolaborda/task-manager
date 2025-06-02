import {
  Component,
  Input,
  AfterContentInit,
  ContentChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterContentInit {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' = 'sm';
  @Input() hover = false;
  @Input() hasFooter?: boolean; // Allow manual override

  @ContentChild('footerRef') footerContent?: ElementRef;

  ngAfterContentInit() {
    // If hasFooter is not explicitly set, auto-detect from projected content
    if (this.hasFooter === undefined) {
      this.hasFooter = !!this.footerContent;
    }
  }

  get cardClasses(): string {
    const baseClasses =
      'bg-white rounded-xl border border-secondary-200 transition-shadow duration-200';

    const paddingClasses: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    const shadowClasses: Record<string, string> = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };

    const hoverClasses = this.hover ? 'hover:shadow-md' : '';

    return [
      baseClasses,
      paddingClasses[this.padding],
      shadowClasses[this.shadow],
      hoverClasses
    ]
      .filter((cls) => cls.length)
      .join(' ');
  }
}
