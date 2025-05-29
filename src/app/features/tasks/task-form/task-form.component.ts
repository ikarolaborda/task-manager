import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../../../services/tasks.service';
import { Task, CreateTaskDto } from '../../../models';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent
  ],
  template: `
    <!-- Modal Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="w-full max-w-lg">
        <app-card>
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-secondary-900">
              {{ isEditing ? 'Edit Task' : 'Create New Task' }}
            </h2>
            <button
              (click)="onClose()"
              class="text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <app-input
              id="title"
              label="Title"
              placeholder="Enter task title"
              formControlName="title"
              [required]="true"
              [errorMessage]="getFieldError('title')"
            ></app-input>

            <div>
              <label for="description" class="block text-sm font-medium text-secondary-700 mb-1">
                Description
                <span class="text-error-500">*</span>
              </label>
              <textarea
                id="description"
                formControlName="description"
                placeholder="Enter task description"
                rows="4"
                [class]="textareaClasses"
              ></textarea>
              <p *ngIf="getFieldError('description')" class="text-sm text-error-600 mt-1">
                {{ getFieldError('description') }}
              </p>
            </div>

            <div *ngIf="errorMessage" class="bg-error-50 border border-error-200 rounded-lg p-3">
              <p class="text-sm text-error-600">{{ errorMessage }}</p>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3 pt-4">
              <app-button
                variant="outline"
                (clicked)="onClose()"
                [fullWidth]="true"
              >
                Cancel
              </app-button>
              
              <app-button
                type="submit"
                [loading]="isLoading"
                [disabled]="taskForm.invalid"
                [fullWidth]="true"
              >
                {{ isEditing ? 'Update Task' : 'Create Task' }}
              </app-button>
            </div>
          </form>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  
  @Output() taskSaved = new EventEmitter<Task>();
  @Output() formClosed = new EventEmitter<void>();
  
  taskForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }
  
  ngOnInit(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description
      });
    }
  }
  
  get isEditing(): boolean {
    return !!this.task;
  }
  
  get textareaClasses(): string {
    const baseClasses = 'block w-full px-3 py-2 border rounded-lg text-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200 disabled:bg-secondary-50 disabled:text-secondary-500 resize-none';
    
    const field = this.taskForm.get('description');
    if (field?.touched && field?.errors) {
      return `${baseClasses} border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500`;
    }
    
    return `${baseClasses} border-secondary-300 focus:ring-primary-500 focus:border-transparent`;
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formValue = this.taskForm.value;
      
      if (this.isEditing) {
        // Update existing task - Note: API doesn't support updating title/description
        // This would need a PUT endpoint for full task updates
        this.errorMessage = 'Task editing is not currently supported by the API';
        this.isLoading = false;
      } else {
        // Create new task
        const createTaskDto: CreateTaskDto = {
          title: formValue.title,
          description: formValue.description
        };
        
        this.tasksService.createTask(createTaskDto).subscribe({
          next: (task) => {
            this.taskSaved.emit(task);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Failed to create task';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    }
  }
  
  onClose(): void {
    this.formClosed.emit();
  }
  
  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `Must be no more than ${maxLength} characters`;
      }
    }
    return '';
  }
} 