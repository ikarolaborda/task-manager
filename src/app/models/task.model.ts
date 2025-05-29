export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface CreateTaskDto {
  title: string;
  description: string;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

export interface TaskFilter {
  status?: TaskStatus;
  search?: string;
} 