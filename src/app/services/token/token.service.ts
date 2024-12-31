import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private httpClient: HttpClient) { }
  
    public getToken(code: string): Observable<any> {
      let body = new HttpParams()
      .set('grant_type', environment.grant_type)
      .set('client_id', environment.client_id)
      .set('redirect_uri', environment.redirect_uri)
      .set('code', code)
      const basic_auth = 'Basic '+ btoa(`${environment.client_id}:${environment.client_secret}`);
      const headers_object = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'Authorization': basic_auth
      });
      const httpOptions = { headers: headers_object};
      return this.httpClient.post<any>(environment.token_endpoint, body, httpOptions);
    }
}
