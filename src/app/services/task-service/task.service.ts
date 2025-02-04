import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AssignToRequest, Task, TaskCommentRequest, TaskRequest, TaskResponse, TaskUpdateStatusRequest } from '../../models/task';
import { TokenService } from '../token/token.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
  gateway_url = environment.api_gateway;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {}

  public createTask(task: TaskRequest): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<Task>(this.gateway_url + '/tasks', task, { headers });
  }

  public getAllTaskByUser(): Observable<TaskResponse> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<TaskResponse>(this.gateway_url + '/tasks/user', { headers });
  }
  
  public getAllCreatedTasks(): Observable<TaskResponse> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<TaskResponse>(this.gateway_url + '/tasks', { headers });
  }

  public updateTask(task: TaskRequest, taskId: string): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<Task>(this.gateway_url + `/tasks/update/${taskId}`, task, { headers });
  }

  public addUserComment(task: TaskCommentRequest): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<Task>(this.gateway_url + '/tasks/comment', task, { headers });
  }

  public changeTaskStatus(task: TaskUpdateStatusRequest): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<Task>(this.gateway_url + '/tasks/status', task, { headers });
  }

  public deleteTask(taskId: string): Observable<void> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.delete<void>(this.gateway_url + `/tasks/delete/${taskId}`, { headers });
  }

  public changeAssignedUser(assingToRequest: AssignToRequest): Observable<Task> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<Task>(this.gateway_url + '/tasks/assign-to', assingToRequest, { headers });
  }
}
