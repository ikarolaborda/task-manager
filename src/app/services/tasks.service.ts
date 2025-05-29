import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskDto, TaskStatus, TaskFilter } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly API_URL = 'http://localhost:3000/tasks';
  
  constructor(private http: HttpClient) {}
  
  getTasks(filter?: TaskFilter): Observable<Task[]> {
    let params = new HttpParams();
    
    if (filter?.status) {
      params = params.set('status', filter.status);
    }
    
    if (filter?.search) {
      params = params.set('search', filter.search);
    }
    
    return this.http.get<Task[]>(this.API_URL, { params });
  }
  
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }
  
  createTask(taskDto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.API_URL, taskDto);
  }
  
  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}/status`, { status });
  }
  
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
} 