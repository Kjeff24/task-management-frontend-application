import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenResponse } from '../../models/token-reponse';

const ID_TOKEN = 'id_token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  adminGroup: string = environment.adminGroup;

  constructor(private httpClient: HttpClient) {}

  login(): void {
    let params = new HttpParams()
      .set('response_type', environment.response_type)
      .set('client_id', environment.client_id)
      .set('redirect_uri', environment.redirect_uri);

    location.href = environment.login_endpoint + '?' + params;
  }

  public getToken(code: string): Observable<TokenResponse> {
    let body = new HttpParams()
      .set('grant_type', environment.grant_type)
      .set('client_id', environment.client_id)
      .set('redirect_uri', environment.redirect_uri)
      .set('code', code);
    const basic_auth =
      'Basic ' + btoa(`${environment.client_id}:${environment.client_secret}`);
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '*/*',
      Authorization: basic_auth,
    });
    const httpOptions = { headers: headers_object };
    return this.httpClient.post<TokenResponse>(
      environment.token_endpoint,
      body,
      httpOptions
    );
  }

  setTokens(idToken: string): void {
    sessionStorage.removeItem(ID_TOKEN);
    sessionStorage.setItem(ID_TOKEN, idToken);
  }

  clear(): void {
    sessionStorage.removeItem(ID_TOKEN);
  }

  getIdToken(): string | null {
    return sessionStorage.getItem(ID_TOKEN);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(ID_TOKEN) != null;
  }

  getPayload() : {email: string, sub: string, isAdmin: boolean, isUser: boolean  } | null {
    const token = this.getIdToken();
    if(token) {
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload);
      const values = JSON.parse(decodedPayload);
      const isAdmin = values['cognito:groups'] && values['cognito:groups'].includes('ADMIN');
      const isUser = values['cognito:groups'] && values['cognito:groups'].includes('USER');
      return {
        email: values.email,
        sub: values.sub,
        isAdmin: isAdmin || false,
        isUser: isUser || false
      };
      
    } else {
      return null;
    }
  }

}
