import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardComponent } from './card.component';

// Make TestHostComponent standalone and import CardComponent directly
@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card [hasFooter]="true">
      <div #footerRef slot="footer" class="dummy-footer">
        Projected Footer Content
      </div>
    </app-card>
  `
})
class TestHostComponent {}

describe('CardComponent › Footer Styling', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since TestHostComponent is standalone, put it in "imports" (not declarations)
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    // Force initial detection and wait for content projection
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    hostFixture.detectChanges();
  });

  it('should apply correct footer classes when shown', () => {
    // Get the card component instance to check hasFooter
    const cardComponent = hostFixture.debugElement.query(By.css('app-card')).componentInstance;
    expect(cardComponent.hasFooter).toBe(true, 'Expected hasFooter to be true after content projection');
    
    // Look for the footer wrapper more broadly
    const footerWrapper = hostFixture.debugElement.query(
      By.css('div[class*="mt-4"]')
    );
    expect(footerWrapper).toBeTruthy('Expected footer wrapper to exist');

    // Finally, ensure those exact classes appear in the outerHTML
    const html = footerWrapper.nativeElement.outerHTML;
    expect(html).toContain('mt-4');
    expect(html).toContain('pt-4');
    expect(html).toContain('border-t');
    expect(html).toContain('border-secondary-200');
  });
});
