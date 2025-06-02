import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../../models';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
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