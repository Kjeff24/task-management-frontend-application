import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../token/token.service';
import { UserRequest } from '../../models/user';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/message';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  gateway_url = environment.api_gateway;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {}

  public createUser(user: UserRequest): Observable<MessageResponse> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<MessageResponse>(
      this.gateway_url + '/user-management',
      user,
      { headers }
    );
  }

  public getAllUsers(): Observable<MessageResponse> {
      const token = this.tokenService.getIdToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.httpClient.get<MessageResponse>(this.gateway_url + '/user-management', { headers });
    }
}
