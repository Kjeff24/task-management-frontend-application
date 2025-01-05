import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskRequest, TaskResponse } from '../../models/task';
import { TokenService } from '../token/token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {}

  public createTask(task: TaskRequest): Observable<TaskResponse> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<TaskResponse>('url', task, { headers });
  }

  
  public updateTask(task: TaskRequest): Observable<TaskResponse> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<TaskResponse>('url', task, { headers });
  }
}
