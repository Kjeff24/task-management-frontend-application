import { Component } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenResponse } from '../../models/token-reponse';
import { NewTaskModalComponent } from '../../components/new-task-modal/new-task-modal.component';
import { CommonModule } from '@angular/common';
import { TaskRequest } from '../../models/task';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NewTaskModalComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  code = '';
  isModalOpen = false;

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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addTask(task: TaskRequest) {
    console.log('Task added:', task);
  }

}
