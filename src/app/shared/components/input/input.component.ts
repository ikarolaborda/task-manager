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
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
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