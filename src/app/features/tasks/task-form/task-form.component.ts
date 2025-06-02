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
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
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