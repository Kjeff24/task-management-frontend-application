import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../token/token.service';
import { UserRequest, UserResponse } from '../../models/user';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/message';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  gateway_url = environment.api_gateway;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {}

  public createUser(user: UserRequest): Observable<UserResponse> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(user);
    return this.httpClient.post<UserResponse>(
      this.gateway_url + '/user-management',
      user,
      { headers }
    );
  }

  public getAllTeamMembers(): Observable<UserResponse[]> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<UserResponse[]>(
      this.gateway_url + '/user-management/team-members',
      { headers }
    );
  }

  public getAllUsers(): Observable<UserResponse[]> {
    const token = this.tokenService.getIdToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<UserResponse[]>(
      this.gateway_url + '/user-management',
      { headers }
    );
  }
}
