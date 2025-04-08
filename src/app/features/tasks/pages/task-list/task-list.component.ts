import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskStatus } from '../../../../core/models/task.model';
import { TaskFilter } from '../../../../core/models/task-filter.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  filterForm: FormGroup;
  openDropdownId: number | null = null; // Track which dropdown is open

  taskStatus = TaskStatus;
  taskStatusOptions = [
    { value: '', label: 'All' },
    { value: TaskStatus.OPEN, label: 'Open' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.DONE, label: 'Done' }
  ];

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      search: ['']
    });
  }

  ngOnInit(): void {
    this.loadTasks();

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((filters: TaskFilter) => {
        this.loadTasks(filters);
      });
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openDropdownId !== null &&
      !(event.target as HTMLElement).closest('.status-dropdown')) {
      this.openDropdownId = null;
    }
  }
  toggleDropdown(event: Event, taskId: number): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === taskId ? null : taskId;
  }

  loadTasks(filters?: TaskFilter): void {
    this.loading = true;
    this.error = '';

    this.taskService.getTasks(filters).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete task. Please try again.';
          console.error(err);
        }
      });
    }
  }

  updateStatus(task: Task, status: TaskStatus): void {
    this.openDropdownId = null;

    if (task.status !== status) {
      this.taskService.updateTaskStatus(task.id, status).subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
        },
        error: (err) => {
          this.error = 'Failed to update task status. Please try again.';
          console.error(err);
        }
      });
    }
  }

  getTaskStatusOptions(startIndex: number = 0): any[] {
    return this.taskStatusOptions.slice(startIndex);
  }
}
