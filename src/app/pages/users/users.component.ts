import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';
import { UserRequest, UserResponse } from '../../models/user';
import { MessageResponse } from '../../models/message';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from '../../components/add-user/add-user.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule,
    AddUserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  isAddUserModalOpen = false;
  users: UserResponse[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }
  
  goHome(): void {
    this.router.navigate(['/']);
  }

  addUserModalToggle() {
    this.isAddUserModalOpen = !this.isAddUserModalOpen;
  }

  saveUser(userRequest: UserRequest) {
    this.userService.createUser(userRequest).subscribe({
      next: (user: UserResponse) => {
        this.users.push(user);
      },
      error: (error: MessageResponse) => {
        console.log(error.message);
      },
    });
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: UserResponse[]) => {
        this.users = users;
      },
      error: (error: MessageResponse) => {
        console.error(error.message);
      },
    });
  }
}
