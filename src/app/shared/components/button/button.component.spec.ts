import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default properties', () => {
      expect(component.variant).toBe('primary');
      expect(component.size).toBe('md');
      expect(component.disabled).toBe(false);
      expect(component.loading).toBe(false);
      expect(component.type).toBe('button');
      expect(component.fullWidth).toBe(false);
    });
  });

  describe('Button Rendering', () => {
    it('should render button element', () => {
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement).toBeTruthy();
    });

    it('should apply correct type attribute', () => {
      component.type = 'submit';
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.type).toBe('submit');
    });

    it('should render projected content', () => {
      const testContent = 'Test Button';
      fixture = TestBed.createComponent(ButtonComponent);
      fixture.debugElement.nativeElement.innerHTML = `<app-button>${testContent}</app-button>`;
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.textContent).toContain(testContent);
    });
  });

  describe('Button Variants', () => {
    it('should apply primary variant classes', () => {
      component.variant = 'primary';
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('bg-primary-600');
      expect(buttonClasses).toContain('text-white');
      expect(buttonClasses).toContain('hover:bg-primary-700');
    });

    it('should apply secondary variant classes', () => {
      component.variant = 'secondary';
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('bg-secondary-100');
      expect(buttonClasses).toContain('text-secondary-900');
      expect(buttonClasses).toContain('hover:bg-secondary-200');
    });

    it('should apply danger variant classes', () => {
      component.variant = 'danger';
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('bg-error-600');
      expect(buttonClasses).toContain('text-white');
      expect(buttonClasses).toContain('hover:bg-error-700');
    });

    it('should apply outline variant classes', () => {
      component.variant = 'outline';
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('border');
      expect(buttonClasses).toContain('border-secondary-300');
      expect(buttonClasses).toContain('text-secondary-700');
      expect(buttonClasses).toContain('bg-white');
    });
  });

  describe('Button Sizes', () => {
    it('should apply small size classes', () => {
      component.size = 'sm';
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('px-3');
      expect(buttonClasses).toContain('py-2');
      expect(buttonClasses).toContain('text-sm');
      expect(buttonClasses).toContain('rounded-md');
    });

    it('should apply medium size classes', () => {
      component.size = 'md';
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('px-4');
      expect(buttonClasses).toContain('py-2');
      expect(buttonClasses).toContain('text-sm');
      expect(buttonClasses).toContain('rounded-lg');
    });

    it('should apply large size classes', () => {
      component.size = 'lg';
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('px-6');
      expect(buttonClasses).toContain('py-3');
      expect(buttonClasses).toContain('text-base');
      expect(buttonClasses).toContain('rounded-lg');
    });
  });

  describe('Button States', () => {
    it('should apply full width classes when fullWidth is true', () => {
      component.fullWidth = true;
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('w-full');
    });

    it('should not apply full width classes when fullWidth is false', () => {
      component.fullWidth = false;
      fixture.detectChanges();
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).not.toContain('w-full');
    });

    it('should disable button when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should disable button when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should show loading spinner when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();
      const spinnerElement = fixture.debugElement.query(By.css('svg.animate-spin'));
      expect(spinnerElement).toBeTruthy();
    });

    it('should not show loading spinner when loading is false', () => {
      component.loading = false;
      fixture.detectChanges();
      const spinnerElement = fixture.debugElement.query(By.css('svg.animate-spin'));
      expect(spinnerElement).toBeFalsy();
    });
  });

  describe('Button Events', () => {
    it('should emit clicked event when button is clicked', () => {
      spyOn(component.clicked, 'emit');
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      
      buttonElement.nativeElement.click();
      
      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit clicked event when button is disabled', () => {
      component.disabled = true;
      spyOn(component.clicked, 'emit');
      fixture.detectChanges();
      
      component.onClick();
      
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('should not emit clicked event when button is loading', () => {
      component.loading = true;
      spyOn(component.clicked, 'emit');
      fixture.detectChanges();
      
      component.onClick();
      
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('should emit clicked event when button is neither disabled nor loading', () => {
      component.disabled = false;
      component.loading = false;
      spyOn(component.clicked, 'emit');
      
      component.onClick();
      
      expect(component.clicked.emit).toHaveBeenCalled();
    });
  });

  describe('Button Classes', () => {
    it('should always include base classes', () => {
      const buttonClasses = component.buttonClasses;
      expect(buttonClasses).toContain('inline-flex');
      expect(buttonClasses).toContain('items-center');
      expect(buttonClasses).toContain('justify-center');
      expect(buttonClasses).toContain('font-medium');
      expect(buttonClasses).toContain('focus:outline-none');
      expect(buttonClasses).toContain('focus:ring-2');
      expect(buttonClasses).toContain('focus:ring-offset-2');
      expect(buttonClasses).toContain('transition-colors');
      expect(buttonClasses).toContain('duration-200');
      expect(buttonClasses).toContain('disabled:opacity-50');
      expect(buttonClasses).toContain('disabled:cursor-not-allowed');
    });

    it('should combine all classes correctly', () => {
      component.variant = 'primary';
      component.size = 'lg';
      component.fullWidth = true;
      fixture.detectChanges();
      
      const buttonClasses = component.buttonClasses;
      
      // Should contain base classes
      expect(buttonClasses).toContain('inline-flex');
      // Should contain variant classes
      expect(buttonClasses).toContain('bg-primary-600');
      // Should contain size classes
      expect(buttonClasses).toContain('px-6');
      expect(buttonClasses).toContain('py-3');
      // Should contain width classes
      expect(buttonClasses).toContain('w-full');
    });
  });
}); 