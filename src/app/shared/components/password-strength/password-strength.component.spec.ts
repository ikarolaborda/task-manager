import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PasswordStrengthComponent, PasswordStrength, PasswordCriteria } from './password-strength.component';

describe('PasswordStrengthComponent', () => {
  let component: PasswordStrengthComponent;
  let fixture: ComponentFixture<PasswordStrengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default properties', () => {
      expect(component.password).toBe('');
      expect(component.strength.score).toBe(0);
      expect(component.strength.label).toBe('Very Weak');
      expect(component.strength.color).toBe('text-secondary-500');
      expect(component.strength.criteria.length).toBe(false);
      expect(component.strength.criteria.uppercase).toBe(false);
      expect(component.strength.criteria.lowercase).toBe(false);
      expect(component.strength.criteria.number).toBe(false);
      expect(component.strength.criteria.special).toBe(false);
    });
  });

  describe('Password Strength Calculation', () => {
    describe('Length Criteria', () => {
      it('should require at least 8 characters', () => {
        component.password = '1234567';
        component.ngOnChanges();
        expect(component.strength.criteria.length).toBe(false);

        component.password = '12345678';
        component.ngOnChanges();
        expect(component.strength.criteria.length).toBe(true);
      });
    });

    describe('Character Type Criteria', () => {
      it('should detect uppercase letters', () => {
        component.password = 'password';
        component.ngOnChanges();
        expect(component.strength.criteria.uppercase).toBe(false);

        component.password = 'Password';
        component.ngOnChanges();
        expect(component.strength.criteria.uppercase).toBe(true);
      });

      it('should detect lowercase letters', () => {
        component.password = 'PASSWORD';
        component.ngOnChanges();
        expect(component.strength.criteria.lowercase).toBe(false);

        component.password = 'Password';
        component.ngOnChanges();
        expect(component.strength.criteria.lowercase).toBe(true);
      });

      it('should detect numbers', () => {
        component.password = 'Password';
        component.ngOnChanges();
        expect(component.strength.criteria.number).toBe(false);

        component.password = 'Password1';
        component.ngOnChanges();
        expect(component.strength.criteria.number).toBe(true);
      });

      it('should detect special characters', () => {
        component.password = 'Password1';
        component.ngOnChanges();
        expect(component.strength.criteria.special).toBe(false);

        component.password = 'Password1!';
        component.ngOnChanges();
        expect(component.strength.criteria.special).toBe(true);
      });
    });

    describe('Score Calculation', () => {
      it('should give score 0 for empty password', () => {
        component.password = '';
        component.ngOnChanges();
        expect(component.strength.score).toBe(0);
      });

      it('should give score 2 for length + lowercase only', () => {
        component.password = 'password';
        component.ngOnChanges();
        expect(component.strength.score).toBe(2); // length + lowercase
      });

      it('should give score 3 for length + uppercase + lowercase', () => {
        component.password = 'Password';
        component.ngOnChanges();
        expect(component.strength.score).toBe(3); // length + uppercase + lowercase
      });

      it('should give score 2 for length + uppercase only', () => {
        component.password = 'PASSWORD';
        component.ngOnChanges();
        expect(component.strength.score).toBe(2); // length + uppercase
      });

      it('should give score 4 for all criteria met', () => {
        component.password = 'Password1';
        component.ngOnChanges();
        expect(component.strength.score).toBe(4); // length + uppercase + lowercase + number/special
      });

      it('should give score 4 for all criteria', () => {
        component.password = 'Password1!';
        component.ngOnChanges();
        expect(component.strength.score).toBe(4);
      });

      it('should give bonus score for long password with number and special', () => {
        component.password = 'Password123!';
        component.ngOnChanges();
        expect(component.strength.score).toBe(4);
      });

      it('should give correct score for different password types', () => {
        // Test score 2: length + one character type
        component.password = '12345678'; // length + numbers = score 2
        component.ngOnChanges();
        expect(component.strength.score).toBe(2);
        expect(component.strength.label).toBe('Fair');
        expect(component.strength.color).toBe('text-warning-500');
      });
    });

    describe('Strength Labels', () => {
      it('should label score 0 as Very Weak', () => {
        component.password = '';
        component.ngOnChanges();
        expect(component.strength.label).toBe('Very Weak');
        expect(component.strength.color).toBe('text-error-600');
      });

      it('should label score 2 as Fair', () => {
        component.password = '12345678'; // length + numbers = score 2
        component.ngOnChanges();
        expect(component.strength.label).toBe('Fair');
        expect(component.strength.color).toBe('text-warning-500');
      });

      it('should label score 2 as Fair', () => {
        component.password = 'password'; // length + lowercase
        component.ngOnChanges();
        expect(component.strength.label).toBe('Fair');
        expect(component.strength.color).toBe('text-warning-500');
      });

      it('should label score 3 as Strong', () => {
        component.password = 'Password'; // length + uppercase + lowercase
        component.ngOnChanges();
        expect(component.strength.label).toBe('Strong');
        expect(component.strength.color).toBe('text-warning-600');
      });

      it('should label score 4 as Very Strong', () => {
        component.password = 'Password1!';
        component.ngOnChanges();
        expect(component.strength.label).toBe('Very Strong');
        expect(component.strength.color).toBe('text-success-600');
      });
    });
  });

  describe('UI Rendering', () => {
    beforeEach(() => {
      component.password = 'Password1!';
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should render strength bars', () => {
      const strengthBars = fixture.debugElement.queryAll(By.css('.h-2.flex-1.rounded-full'));
      expect(strengthBars.length).toBe(4);
    });

    it('should render strength label', () => {
      const strengthLabel = fixture.debugElement.query(By.css('.text-sm.font-medium'));
      expect(strengthLabel).toBeTruthy();
      expect(strengthLabel.nativeElement.textContent.trim()).toBe('Very Strong');
    });

    it('should render character count', () => {
      const charCount = fixture.debugElement.query(By.css('.text-xs.text-secondary-500'));
      expect(charCount).toBeTruthy();
      expect(charCount.nativeElement.textContent.trim()).toBe('10/20 characters');
    });

    it('should render all criteria items', () => {
      const criteriaItems = fixture.debugElement.queryAll(By.css('.flex.items-center.text-xs'));
      expect(criteriaItems.length).toBe(4);
    });

    it('should show checkmarks for met criteria', () => {
      const checkmarks = fixture.debugElement.queryAll(By.css('svg'));
      // Should have checkmarks for all criteria since password is "Password1!"
      expect(checkmarks.length).toBeGreaterThan(0);
    });
  });

  describe('Strength Bar Colors', () => {
    it('should apply correct colors for very weak password', () => {
      component.password = '';
      component.ngOnChanges();
      fixture.detectChanges();

      const strengthBars = fixture.debugElement.queryAll(By.css('.h-2.flex-1.rounded-full'));
      strengthBars.forEach(bar => {
        expect(bar.nativeElement.className).toContain('bg-gray-200');
      });
    });

    it('should apply correct colors for weak password', () => {
      component.password = 'password'; // score 2 = Fair
      component.ngOnChanges();
      fixture.detectChanges();

      const strengthBars = fixture.debugElement.queryAll(By.css('.h-2.flex-1.rounded-full'));
      // First two bars should be colored, rest should be gray for Fair (score 2)
      expect(strengthBars[0].nativeElement.className).toContain('bg-warning-400');
      expect(strengthBars[1].nativeElement.className).toContain('bg-warning-400');
      for (let i = 2; i < strengthBars.length; i++) {
        expect(strengthBars[i].nativeElement.className).toContain('bg-gray-200');
      }
    });

    it('should apply correct colors for very strong password', () => {
      component.password = 'Password1!';
      component.ngOnChanges();
      fixture.detectChanges();

      const strengthBars = fixture.debugElement.queryAll(By.css('.h-2.flex-1.rounded-full'));
      // All bars should be green for very strong
      strengthBars.forEach(bar => {
        expect(bar.nativeElement.className).toContain('bg-success-500');
      });
    });
  });

  describe('Criteria Icons and Styling', () => {
    it('should show success styling for met criteria', () => {
      component.password = 'Password1!';
      component.ngOnChanges();
      fixture.detectChanges();

      const criteriaItems = fixture.debugElement.queryAll(By.css('.flex.items-center.text-xs'));
      
      criteriaItems.forEach(item => {
        const icon = item.query(By.css('.w-4.h-4.rounded-full'));
        const text = item.query(By.css('span:last-child'));
        
        expect(icon.nativeElement.className).toContain('bg-success-100');
        expect(icon.nativeElement.className).toContain('text-success-600');
        expect(text.nativeElement.className).toContain('text-success-700');
      });
    });

    it('should show default styling for unmet criteria', () => {
      component.password = '';
      component.ngOnChanges();
      fixture.detectChanges();

      const criteriaIcons = fixture.debugElement.queryAll(By.css('.w-4.h-4.rounded-full'));
      
      // All criteria should be unmet for empty password
      criteriaIcons.forEach(icon => {
        expect(icon.nativeElement.className).toContain('bg-secondary-100');
        expect(icon.nativeElement.className).toContain('text-secondary-400');
      });
    });

    it('should show checkmark icons for met criteria', () => {
      component.password = 'Password1!';
      component.ngOnChanges();
      fixture.detectChanges();

      const checkmarks = fixture.debugElement.queryAll(By.css('svg'));
      expect(checkmarks.length).toBeGreaterThan(0);
      
      checkmarks.forEach(checkmark => {
        // For SVG elements, we need to check the class attribute differently
        const classAttr = checkmark.nativeElement.getAttribute('class');
        expect(classAttr).toContain('w-2.5');
        expect(classAttr).toContain('h-2.5');
      });
    });

    it('should show dots for unmet criteria', () => {
      component.password = '';
      component.ngOnChanges();
      fixture.detectChanges();

      const dots = fixture.debugElement.queryAll(By.css('span'));
      const dotElements = dots.filter(dot => dot.nativeElement.textContent.trim() === '•');
      expect(dotElements.length).toBeGreaterThan(0);
    });
  });

  describe('Special Character Detection', () => {
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ',', '.', '?', '"', ':', '{', '}', '|', '<', '>'];
    
    specialChars.forEach(char => {
      it(`should detect special character: ${char}`, () => {
        component.password = `Password1${char}`;
        component.ngOnChanges();
        expect(component.strength.criteria.special).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long passwords', () => {
      component.password = 'A'.repeat(100) + 'a1!';
      component.ngOnChanges();
      expect(component.strength.score).toBe(4);
      expect(component.strength.label).toBe('Very Strong');
    });

    it('should handle passwords with only numbers', () => {
      component.password = '12345678';
      component.ngOnChanges();
      expect(component.strength.criteria.length).toBe(true);
      expect(component.strength.criteria.number).toBe(true);
      expect(component.strength.criteria.uppercase).toBe(false);
      expect(component.strength.criteria.lowercase).toBe(false);
      expect(component.strength.criteria.special).toBe(false);
    });

    it('should handle passwords with only special characters', () => {
      component.password = '!@#$%^&*';
      component.ngOnChanges();
      expect(component.strength.criteria.length).toBe(true);
      expect(component.strength.criteria.special).toBe(true);
      expect(component.strength.criteria.uppercase).toBe(false);
      expect(component.strength.criteria.lowercase).toBe(false);
      expect(component.strength.criteria.number).toBe(false);
    });

    it('should handle password changes through ngOnChanges', () => {
      component.password = 'weak';
      component.ngOnChanges();
      const weakScore = component.strength.score;
      
      component.password = 'StrongPassword1!';
      component.ngOnChanges();
      const strongScore = component.strength.score;
      
      expect(strongScore).toBeGreaterThan(weakScore);
    });
  });
}); 