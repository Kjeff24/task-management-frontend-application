import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task, TaskCommentRequest, TaskRequest, TaskResponse, TaskUpdateStatusRequest } from '../../models/task';
import { TokenService } from '../token/token.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {}

  public createTask(task: TaskRequest): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<Task>(environment.api_gateway + '/tasks', task, { headers });
  }

  public getAllTaskByUser(): Observable<TaskResponse> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<TaskResponse>(environment.api_gateway + '/tasks/user', { headers });
  }
  
  public getAllCreatedTasks(): Observable<TaskResponse> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<TaskResponse>(environment.api_gateway + '/tasks', { headers });
  }

  public updateTask(task: TaskRequest, taskId: string): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<Task>(environment.api_gateway + `/tasks/update/${taskId}`, task, { headers });
  }

  public addUserComment(task: TaskCommentRequest): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<Task>(environment.api_gateway + '/tasks/comment', task, { headers });
  }

  public changeTaskStatus(task: TaskUpdateStatusRequest): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<Task>(environment.api_gateway + '/tasks/comment', task, { headers });
  }
}
