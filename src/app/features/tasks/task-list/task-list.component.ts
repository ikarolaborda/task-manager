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
  template: `
    <div class="min-h-screen bg-secondary-50">
      <!-- Header -->
      <header class="bg-white border-b border-secondary-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div>
              <h1 class="text-2xl font-bold text-secondary-900">Task Manager</h1>
              <p class="text-secondary-600">Welcome back, {{ currentUser?.username }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <app-button (clicked)="showTaskForm = true">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                New Task
              </app-button>
              <app-button variant="outline" (clicked)="signOut()">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Sign Out
              </app-button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Filters and Search -->
        <div class="mb-8">
          <app-card>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Search -->
              <div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  [formControl]="searchControl"
                  class="input-field"
                >
              </div>

              <!-- Status Filter -->
              <div>
                <select
                  [value]="selectedStatus"
                  (change)="onStatusFilterChange($event)"
                  class="input-field"
                >
                  <option value="">All Tasks</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <!-- Task Count -->
              <div class="flex items-center justify-end text-sm text-secondary-600">
                <span>{{ filteredTasks.length }} of {{ totalTasks }} tasks</span>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Task Grid -->
        <div *ngIf="filteredTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-task-card
            *ngFor="let task of filteredTasks; trackBy: trackByTaskId"
            [task]="task"
            (statusChanged)="onTaskStatusChanged($event)"
            (taskDeleted)="onTaskDeleted($event)"
            (taskEdit)="onTaskEdit($event)"
          ></app-task-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredTasks.length === 0 && !isLoading" class="text-center py-12">
          <app-card>
            <div class="py-8">
              <svg class="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 112 4v6a2 2 0 11-2 4v6a2 2 0 112 4v6a2 2 0 11-2 4M9 21h6m0 0v10a2 2 0 11-4 0v-10M35 15a2 2 0 002-2V4a2 2 0 012-2h4a2 2 0 012 2v9a2 2 0 01-2 2v20a2 2 0 01-2 2h-4a2 2 0 01-2-2V15z"></path>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-secondary-900">No tasks found</h3>
              <p class="mt-2 text-secondary-500">
                {{ hasActiveFilters ? 'Try adjusting your filters' : 'Get started by creating your first task' }}
              </p>
              <div class="mt-6">
                <app-button *ngIf="!hasActiveFilters" (clicked)="showTaskForm = true">
                  Create your first task
                </app-button>
                <app-button *ngIf="hasActiveFilters" variant="outline" (clicked)="clearFilters()">
                  Clear filters
                </app-button>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-secondary-600">Loading tasks...</p>
        </div>
      </main>

      <!-- Task Form Modal -->
      <app-task-form
        *ngIf="showTaskForm"
        [task]="editingTask"
        (taskSaved)="onTaskSaved($event)"
        (formClosed)="onFormClosed()"
      ></app-task-form>
    </div>
  `,
  styles: []
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