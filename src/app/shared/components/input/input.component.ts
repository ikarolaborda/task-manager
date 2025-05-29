import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-secondary-700">
        {{ label }}
        <span *ngIf="required" class="text-error-500">*</span>
      </label>
      
      <div class="relative">
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [class]="inputClasses"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />
        
        <div *ngIf="hasError" class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg class="h-5 w-5 text-error-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <p *ngIf="hasError && errorMessage" class="text-sm text-error-600">
        {{ errorMessage }}
      </p>
      
      <p *ngIf="helperText && !hasError" class="text-sm text-secondary-500">
        {{ helperText }}
      </p>
    </div>
  `,
  styles: []
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() helperText = '';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();
  
  value = '';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  get hasError(): boolean {
    return !!this.errorMessage;
  }
  
  get inputClasses(): string {
    const baseClasses = 'block w-full px-3 py-2 border rounded-lg text-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200 disabled:bg-secondary-50 disabled:text-secondary-500';
    
    if (this.hasError) {
      return `${baseClasses} border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500`;
    }
    
    return `${baseClasses} border-secondary-300 focus:ring-primary-500 focus:border-transparent`;
  }
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }
  
  onFocus(): void {
    this.inputFocus.emit();
  }
  
  onBlur(): void {
    this.onTouched();
    this.inputBlur.emit();
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
} 