import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default properties', () => {
      expect(component.id).toBe('');
      expect(component.label).toBe('');
      expect(component.type).toBe('text');
      expect(component.placeholder).toBe('');
      expect(component.required).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.errorMessage).toBe('');
      expect(component.helperText).toBe('');
      expect(component.value).toBe('');
    });
  });

  describe('Input Rendering', () => {
    it('should render input element', () => {
      fixture.detectChanges();
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement).toBeTruthy();
    });

    it('should render label when provided', () => {
      component.label = 'Test Label';
      component.id = 'test-input';
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement).toBeTruthy();
      expect(labelElement.nativeElement.textContent.trim()).toContain('Test Label');
      expect(labelElement.nativeElement.getAttribute('for')).toBe('test-input');
    });

    it('should not render label when not provided', () => {
      fixture.detectChanges();
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement).toBeFalsy();
    });

    it('should show required asterisk when required is true', () => {
      component.label = 'Test Label';
      component.required = true;
      fixture.detectChanges();
      
      const requiredSpan = fixture.debugElement.query(By.css('span.text-error-500'));
      expect(requiredSpan).toBeTruthy();
      expect(requiredSpan.nativeElement.textContent).toBe('*');
    });

    it('should not show required asterisk when required is false', () => {
      component.label = 'Test Label';
      component.required = false;
      fixture.detectChanges();
      
      const requiredSpan = fixture.debugElement.query(By.css('span.text-error-500'));
      expect(requiredSpan).toBeFalsy();
    });
  });

  describe('Input Properties', () => {
    it('should apply correct input attributes', () => {
      component.id = 'test-id';
      component.type = 'email';
      component.placeholder = 'Enter email';
      component.disabled = true;
      component.value = 'test@example.com';
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      
      expect(inputElement.id).toBe('test-id');
      expect(inputElement.type).toBe('email');
      expect(inputElement.placeholder).toBe('Enter email');
      expect(inputElement.disabled).toBe(true);
      expect(inputElement.value).toBe('test@example.com');
    });
  });

  describe('Input Styling', () => {
    it('should apply default input classes when no error', () => {
      component.errorMessage = '';
      fixture.detectChanges();
      
      const inputClasses = component.inputClasses;
      expect(inputClasses).toContain('block');
      expect(inputClasses).toContain('w-full');
      expect(inputClasses).toContain('border-secondary-300');
      expect(inputClasses).toContain('focus:ring-primary-500');
      expect(inputClasses).toContain('focus:border-transparent');
    });

    it('should apply error classes when has error', () => {
      component.errorMessage = 'This field is required';
      fixture.detectChanges();
      
      const inputClasses = component.inputClasses;
      expect(inputClasses).toContain('border-error-300');
      expect(inputClasses).toContain('text-error-900');
      expect(inputClasses).toContain('focus:ring-error-500');
      expect(inputClasses).toContain('focus:border-error-500');
    });

    it('should show error icon when has error', () => {
      component.errorMessage = 'This field is required';
      fixture.detectChanges();
      
      const errorIcon = fixture.debugElement.query(By.css('svg.text-error-500'));
      expect(errorIcon).toBeTruthy();
    });

    it('should not show error icon when no error', () => {
      component.errorMessage = '';
      fixture.detectChanges();
      
      const errorIcon = fixture.debugElement.query(By.css('svg.text-error-500'));
      expect(errorIcon).toBeFalsy();
    });
  });

  describe('Error and Helper Text', () => {
    it('should display error message when hasError is true', () => {
      component.errorMessage = 'This is an error message';
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('p.text-error-600'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent.trim()).toBe('This is an error message');
    });

    it('should not display error message when hasError is false', () => {
      component.errorMessage = '';
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('p.text-error-600'));
      expect(errorElement).toBeFalsy();
    });

    it('should display helper text when no error', () => {
      component.helperText = 'This is helper text';
      component.errorMessage = '';
      fixture.detectChanges();
      
      const helperElement = fixture.debugElement.query(By.css('p.text-secondary-500'));
      expect(helperElement).toBeTruthy();
      expect(helperElement.nativeElement.textContent.trim()).toBe('This is helper text');
    });

    it('should not display helper text when has error', () => {
      component.helperText = 'This is helper text';
      component.errorMessage = 'This is an error';
      fixture.detectChanges();
      
      const helperElement = fixture.debugElement.query(By.css('p.text-secondary-500'));
      expect(helperElement).toBeFalsy();
    });

    it('should correctly identify hasError state', () => {
      component.errorMessage = '';
      expect(component.hasError).toBe(false);
      
      component.errorMessage = 'Error message';
      expect(component.hasError).toBe(true);
    });
  });

  describe('Input Events', () => {
    it('should emit valueChange on input', () => {
      spyOn(component.valueChange, 'emit');
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      inputElement.value = 'test value';
      inputElement.dispatchEvent(new Event('input'));
      
      expect(component.valueChange.emit).toHaveBeenCalledWith('test value');
    });

    it('should emit inputFocus on focus', () => {
      spyOn(component.inputFocus, 'emit');
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      inputElement.dispatchEvent(new Event('focus'));
      
      expect(component.inputFocus.emit).toHaveBeenCalled();
    });

    it('should emit inputBlur on blur', () => {
      spyOn(component.inputBlur, 'emit');
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      inputElement.dispatchEvent(new Event('blur'));
      
      expect(component.inputBlur.emit).toHaveBeenCalled();
    });

    it('should update component value on input event', () => {
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      const mockEvent = { target: { value: 'new value' } } as any;
      
      component.onInput(mockEvent);
      
      expect(component.value).toBe('new value');
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should implement writeValue method', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should handle null value in writeValue', () => {
      component.writeValue(null as any);
      expect(component.value).toBe('');
    });

    it('should handle undefined value in writeValue', () => {
      component.writeValue(undefined as any);
      expect(component.value).toBe('');
    });

    it('should implement registerOnChange method', () => {
      const mockOnChange = jasmine.createSpy('onChange');
      component.registerOnChange(mockOnChange);
      
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      const mockEvent = { target: { value: 'test' } } as any;
      
      component.onInput(mockEvent);
      
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });

    it('should implement registerOnTouched method', () => {
      const mockOnTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockOnTouched);
      
      component.onBlur();
      
      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should implement setDisabledState method', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
      
      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('Form Integration', () => {
    it('should work with reactive forms', () => {
      const formControl = new FormControl('initial value');
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [InputComponent, ReactiveFormsModule]
      });
      
      const testFixture = TestBed.createComponent(InputComponent);
      const testComponent = testFixture.componentInstance;
      
      // Simulate form control binding
      testComponent.writeValue('initial value');
      testFixture.detectChanges();
      
      expect(testComponent.value).toBe('initial value');
    });

    it('should update form control when input changes', () => {
      const mockOnChange = jasmine.createSpy('onChange');
      component.registerOnChange(mockOnChange);
      
      const mockEvent = { target: { value: 'updated value' } } as any;
      component.onInput(mockEvent);
      
      expect(mockOnChange).toHaveBeenCalledWith('updated value');
    });

    it('should mark as touched when input loses focus', () => {
      const mockOnTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockOnTouched);
      
      component.onBlur();
      
      expect(mockOnTouched).toHaveBeenCalled();
    });
  });
}); 