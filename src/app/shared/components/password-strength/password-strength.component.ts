import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  bgColor: string;
  criteria: PasswordCriteria;
}

export interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password = '';
  
  strength: PasswordStrength = {
    score: 0,
    label: 'Very Weak',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-200',
    criteria: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  };
  
  ngOnChanges(): void {
    this.calculateStrength();
  }
  
  private calculateStrength(): void {
    const criteria: PasswordCriteria = {
      length: this.password.length >= 8,
      uppercase: /[A-Z]/.test(this.password),
      lowercase: /[a-z]/.test(this.password),
      number: /\d/.test(this.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(this.password)
    };
    
    // Calculate score based on criteria met
    let score = 0;
    if (criteria.length) score++;
    if (criteria.uppercase) score++;
    if (criteria.lowercase) score++;
    if (criteria.number || criteria.special) score++;
    
    // Bonus point for having both number AND special character
    if (criteria.number && criteria.special && this.password.length >= 12) {
      score = Math.min(4, score + 1);
    }
    
    // Determine strength label and styling
    let label = 'Very Weak';
    let color = 'text-error-600';
    let bgColor = 'bg-error-200';
    
    if (score >= 4) {
      label = 'Very Strong';
      color = 'text-success-600';
      bgColor = 'bg-success-200';
    } else if (score >= 3) {
      label = 'Strong';
      color = 'text-warning-600';
      bgColor = 'bg-warning-200';
    } else if (score >= 2) {
      label = 'Fair';
      color = 'text-warning-500';
      bgColor = 'bg-warning-200';
    } else if (score >= 1) {
      label = 'Weak';
      color = 'text-error-500';
      bgColor = 'bg-error-200';
    }
    
    this.strength = {
      score,
      label,
      color,
      bgColor,
      criteria
    };
  }
} 