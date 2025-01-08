import { Component } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenResponse } from '../../models/token-reponse';
import { NewTaskModalComponent } from '../../components/new-task-modal/new-task-modal.component';
import { CommonModule } from '@angular/common';
import { Task, TaskRequest, TaskResponse, TaskUpdateStatusRequest } from '../../models/task';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskService } from '../../services/task-service/task.service';
import { MessageResponse } from '../../models/message';
import { UserService } from '../../services/user-service/user.service';
import { UserRequest, UserResponse } from '../../models/user';
import { AddUserComponent } from '../../components/add-user/add-user.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NewTaskModalComponent, TaskCardComponent, AddUserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  code = '';
  isNewTaskModalOpen = false;
  isAddUserModalOpen = false;
  taskToUpdate: Task | null = null;
  isTaskUpdate: boolean = false;
  todoMenuItems = [
    'Edit',
    'Mark as Done',
    'Add Comment',
    'Assign To',
    'Delete',
  ];
  doneMenuItems = ['Restore to TODO', 'Add Comment', 'Delete'];
  todoTasks: Task[] = [];
  completedTasks: Task[] = [];
  isAdmin: boolean = false;
  users: UserResponse[] = [];

  constructor(
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.code = data['code'];
      if (this.code) {
        this.getToken(this.code);
      } else if (!this.tokenService.isLoggedIn()) {
        this.tokenService.login();
      } else {
        this.isAdmin = this.tokenService.getPayload()?.isAdmin ?? false;
        this.getAllTask();
      }
    });
  }

  addUserModalToggle() {
    this.isAddUserModalOpen = !this.isAddUserModalOpen;
  }

  newTaskModalToggle() {
    this.isNewTaskModalOpen = !this.isNewTaskModalOpen;
  }

  handleMenuClick(
    section: 'TODO' | 'DONE',
    event: { item: string; task: Task | null }
  ): void {
    if (section === 'TODO') {
      if (event.item === 'Mark as Done') {
        if (event.task) {
          this.markTaskAsDone(event.task?.taskId, 'completed')
        }
      }
      if (event.item === 'Edit') {
        this.newTaskModalToggle();
        this.taskToUpdate = event.task;
        this.isTaskUpdate = true;
      }
    } else if (section === 'DONE') {
      if (event.item === 'Restore to TODO') {
        if (event.task) {
          this.markTaskAsDone(event.task?.taskId, 'open')
        }
      }
    }
  }

  saveTask(event: { task: TaskRequest; taskId: string }) {
    if (this.isTaskUpdate) {
      this.updateTask(event.task, event.taskId);
    } else {
      this.createTask(event.task);
    }
  }

  saveUser(userRequest: UserRequest) {
    this.userService.createUser(userRequest).subscribe({
      next: (user: UserResponse) => {
        this.users.push(user);
      },
      error: (error: MessageResponse) => {
        console.log(error.message)
      }
    })
  }

  getToken(code: string): void {
    this.tokenService.getToken(this.code).subscribe({
      next: (data: TokenResponse) => {
        this.tokenService.setTokens(data.id_token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllTask(): void {
    if (this.isAdmin) {
      this.getAllCreatedTask();
      this.getUsers();
    } else {
      this.getTaskByUser();
    }
  }

  createTask(taskRequest: TaskRequest): void {
    this.taskService.createTask(taskRequest).subscribe({
      next: (task: Task) => {
        this.todoTasks.push(task);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  updateTask(taskRequest: TaskRequest, taskId: string): void {
    this.taskService.updateTask(taskRequest, taskId).subscribe({
      next: (task: Task) => {
        this.todoTasks = this.todoTasks.map((t) => {
          if (t.taskId === task.taskId) {
            return task;
          }
          return t;
        });
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  getAllCreatedTask(): void {
    this.taskService.getAllCreatedTasks().subscribe({
      next: (data: TaskResponse) => {
        this.todoTasks = data.open;
        this.completedTasks = data.completed;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTaskByUser(): void {
    this.taskService.getAllTaskByUser().subscribe({
      next: (data: TaskResponse) => {
        this.todoTasks = data.open;
        this.completedTasks = data.completed;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  markTaskAsDone(taskId: string, status: string) : void {
    const taskUpdateStatusRequest: TaskUpdateStatusRequest = {
      taskId,
      status
    };
    this.taskService.changeTaskStatus(taskUpdateStatusRequest).subscribe({
      next: (task: Task) => {
        if(status === 'completed') {
          this.completedTasks.push(task);
          this.todoTasks = this.todoTasks.filter((t) => t.taskId !== task.taskId);
        } else if(status === 'open') {
          this.todoTasks.push(task);
          this.completedTasks = this.completedTasks.filter((t) => t.taskId !== task.taskId)
        }
      },
      error: (err: MessageResponse) => {
        console.log(err.message);
      },
    })
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: UserResponse[]) => {
        this.users = users;
        console.log(this.users)
      },
      error: (error: MessageResponse) => {
        console.error(error.message);
      }
    })
  }
}
