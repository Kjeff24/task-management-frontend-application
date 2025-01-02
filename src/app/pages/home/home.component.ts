import { Component } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenResponse } from '../../models/token-reponse';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  code = '';

  constructor(
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.code = data['code'];
      if(this.code) {
        this.getToken(this.code);
      }
    });
  }

  login() : void {
    let params = new HttpParams()
      .set('response_type', environment.response_type)
      .set('client_id', environment.client_id)
      .set('redirect_uri', environment.redirect_uri)

    location.href = environment.login_endpoint + '?' + params
  }
  
  getToken(code: string): void {
    this.tokenService.getToken(this.code).subscribe({
      next: (data: TokenResponse) => {
        this.tokenService.setTokens(data.id_token)
      },
      error: (err) => {
        console.log(err);
      },
    })
  }


}
