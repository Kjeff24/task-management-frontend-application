import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  code = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.code = data['code'];
      console.log(this.code);
      // this.getToken(this.code);
    });
  }

  getToken(code: string): void {
    this.tokenService.getToken(this.code).subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

}
