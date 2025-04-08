import {TaskStatus} from './task.model';

export interface TaskFilter {
  status?: TaskStatus;
  search?: string;
}
