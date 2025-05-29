import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../../models';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent],
  template: `
    <app-card [hover]="true" class="h-full">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-secondary-900 truncate">
              {{ task.title }}
            </h3>
            <span [class]="statusBadgeClasses">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-2 ml-4">
            <button
              (click)="onEdit()"
              class="p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
              title="Edit task"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            
            <button
              (click)="onDelete()"
              class="p-1 text-error-400 hover:text-error-600 transition-colors"
              title="Delete task"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Description -->
        <div class="flex-1 mb-4">
          <p class="text-secondary-600 text-sm line-clamp-3">
            {{ task.description }}
          </p>
        </div>
        
        <!-- Status Actions -->
        <div class="mt-auto">
          <div class="flex space-x-2">
            <app-button
              *ngIf="task.status === TaskStatus.OPEN"
              size="sm"
              (clicked)="onStatusChange(TaskStatus.IN_PROGRESS)"
              [fullWidth]="true"
            >
              Start
            </app-button>
            
            <app-button
              *ngIf="task.status === TaskStatus.IN_PROGRESS"
              size="sm"
              variant="secondary"
              (clicked)="onStatusChange(TaskStatus.OPEN)"
            >
              Reopen
            </app-button>
            
            <app-button
              *ngIf="task.status === TaskStatus.IN_PROGRESS"
              size="sm"
              (clicked)="onStatusChange(TaskStatus.DONE)"
            >
              Complete
            </app-button>
            
            <app-button
              *ngIf="task.status === TaskStatus.DONE"
              size="sm"
              variant="secondary"
              (clicked)="onStatusChange(TaskStatus.IN_PROGRESS)"
              [fullWidth]="true"
            >
              Reopen
            </app-button>
          </div>
        </div>
      </div>
    </app-card>
  `,
  styles: [
    `
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `
  ]
})
export class TaskCardComponent {
  @Input() task!: Task;
  
  @Output() statusChanged = new EventEmitter<{ taskId: number; status: TaskStatus }>();
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskEdit = new EventEmitter<Task>();
  
  // Expose TaskStatus enum to template
  TaskStatus = TaskStatus;
  
  get statusBadgeClasses(): string {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (this.task.status) {
      case TaskStatus.OPEN:
        return `${baseClasses} bg-secondary-100 text-secondary-800`;
      case TaskStatus.IN_PROGRESS:
        return `${baseClasses} bg-warning-100 text-warning-800`;
      case TaskStatus.DONE:
        return `${baseClasses} bg-success-100 text-success-800`;
      default:
        return `${baseClasses} bg-secondary-100 text-secondary-800`;
    }
  }
  
  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.OPEN:
        return 'Open';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.DONE:
        return 'Done';
      default:
        return 'Unknown';
    }
  }
  
  onStatusChange(newStatus: TaskStatus): void {
    this.statusChanged.emit({
      taskId: this.task.id,
      status: newStatus
    });
  }
  
  onEdit(): void {
    this.taskEdit.emit(this.task);
  }
  
  onDelete(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskDeleted.emit(this.task.id);
    }
  }
} 