import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TasksService } from '../../../services/tasks.service';
import { AuthService } from '../../../services/auth.service';
import { Task, TaskStatus, TaskFilter, User } from '../../../models';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskCardComponent,
    TaskFormComponent,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchControl = new FormControl('');
  selectedStatus = '';
  showTaskForm = false;
  editingTask: Task | null = null;
  isLoading = false;
  currentUser: User | null = null;

  constructor(
    private tasksService: TasksService,
    private authService: AuthService
  ) {
    this.setupSearch();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTasks();
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get hasActiveFilters(): boolean {
    return !!this.searchControl.value || !!this.selectedStatus;
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadTasks(): void {
    this.isLoading = true;
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to load tasks:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.tasks];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(task => task.status === this.selectedStatus);
    }

    this.filteredTasks = filtered;
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedStatus = '';
    this.applyFilters();
  }

  onTaskStatusChanged(event: { taskId: number; status: TaskStatus }): void {
    this.tasksService.updateTaskStatus(event.taskId, event.status).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Failed to update task status:', error);
      }
    });
  }

  onTaskDeleted(taskId: number): void {
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to delete task:', error);
      }
    });
  }

  onTaskEdit(task: Task): void {
    this.editingTask = task;
    this.showTaskForm = true;
  }

  onTaskSaved(task: Task): void {
    if (this.editingTask) {
      // Update existing task
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks[index] = task;
      }
    } else {
      // Add new task
      this.tasks.unshift(task);
    }
    this.applyFilters();
    this.onFormClosed();
  }

  onFormClosed(): void {
    this.showTaskForm = false;
    this.editingTask = null;
  }

  signOut(): void {
    this.authService.signOut();
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
} 