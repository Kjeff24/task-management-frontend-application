import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCommentComponent } from '../../components/add-comment/add-comment.component';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { NewTaskModalComponent } from '../../components/new-task-modal/new-task-modal.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { MessageResponse } from '../../models/message';
import {
  CommentRequest,
  Task,
  TaskCommentRequest,
  TaskRequest,
  TaskResponse,
  TaskUpdateStatusRequest,
} from '../../models/task';
import { TokenResponse } from '../../models/token-reponse';
import { UserRequest, UserResponse } from '../../models/user';
import { TaskService } from '../../services/task-service/task.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user-service/user.service';
import { AddDeadlineComponent } from '../../components/add-deadline/add-deadline.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NewTaskModalComponent,
    TaskCardComponent,
    AddUserComponent,
    AddUserComponent,
    AddCommentComponent,
    AddDeadlineComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  code = '';
  isNewTaskModalOpen = false;
  isAddUserModalOpen = false;
  isCommentModalOpen = false;
  isDeadlineModalOpen = false;
  taskToUpdate: Task | null = null;
  taskIdToChangeDeadline: string = '';
  isTaskUpdate: boolean = false;
  todoMenuItems = [
    'Edit',
    'Mark as Done',
    'Add Comment',
    'Assign To',
    'Delete',
  ];
  doneMenuItems = ['Restore to TODO', 'Add Comment', 'Delete'];
  expiredMenuItems = ['Restore to TODO'];
  todoTasks: Task[] = [];
  completedTasks: Task[] = [];
  expiredTasks: Task[] = [];
  isAdmin: boolean = false;
  users: UserResponse[] = [];
  taskIdComment: string = '';

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

  commentModalToggle() {
    this.isCommentModalOpen = !this.isCommentModalOpen;
  }

  deadlineModalToggle() {
    this.isDeadlineModalOpen = !this.isDeadlineModalOpen;
  }

  handleMenuClick(
    section: 'TODO' | 'DONE' | 'EXPIRED',
    event: { item: string; task: Task | null }
  ): void {
    if (section === 'TODO') {
      if (event.item === 'Mark as Done' && event.task) {
        this.changeTaskStatus(event.task?.taskId, 'completed');
      }
      if (event.item === 'Edit') {
        this.newTaskModalToggle();
        this.taskToUpdate = event.task;
        this.isTaskUpdate = true;
      }
      if (event.item === 'Add Comment' && event.task) {
        this.commentModalToggle();
        this.taskIdComment = event.task.taskId;
      }
    } else if (section === 'DONE') {
      if (event.item === 'Restore to TODO' && event.task) {
        const currentTime = new Date();
        const deadline = new Date(event.task.deadline);

        if (deadline.getTime() <= currentTime.getTime() + 5 * 60 * 1000) {
          this.taskIdToChangeDeadline = event.task.taskId;
          this.deadlineModalToggle();
        } else {
          this.changeTaskStatus(event.task?.taskId, 'open');
        }
      }
      if (event.item === 'Add Comment' && event.task) {
        this.commentModalToggle();
        this.taskIdComment = event.task.taskId;
      }
    } else if (section === 'EXPIRED') {
      if (event.item === 'Restore to TODO' && event.task) {
        const currentTime = new Date();
        const deadline = new Date(event.task.deadline);

        if (deadline.getTime() <= currentTime.getTime() + 5 * 60 * 1000) {
          this.taskIdToChangeDeadline = event.task.taskId;
          this.deadlineModalToggle();
        } else {
          this.changeTaskStatus(event.task?.taskId, 'open');
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
        console.log(error.message);
      },
    });
  }

  saveComment(commentRequest: CommentRequest) {
    const comment: TaskCommentRequest = {
      taskId: this.taskIdComment,
      comment: commentRequest.comment,
    };
    this.taskService.addUserComment(comment).subscribe({
      next: (task: Task) => {
        this.updateTaskInLists(task);
      },
      error: (error: MessageResponse) => {
        console.log(error.message);
      },
    });
  }

  addDeadline(deadline: string) {
    this.changeTaskStatus(this.taskIdToChangeDeadline, 'open', deadline)
  }

  changeTaskStatus(taskId: string, status: string, deadline?: string): void {
    const taskUpdateStatusRequest: TaskUpdateStatusRequest = {
      taskId,
      status,
      deadline: deadline ? deadline: null,
    };
    this.updateTaskStatus(taskUpdateStatusRequest, status);
  }

  private updateTaskInLists(updatedTask: Task): void {
    const updateTask = (tasks: Task[]) =>
      tasks.map((task) =>
        task.taskId === updatedTask.taskId ? updatedTask : task
      );

    this.todoTasks = updateTask(this.todoTasks);
    this.completedTasks = updateTask(this.completedTasks);
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
        this.todoTasks = this.todoTasks.map((t) =>
          t.taskId === task.taskId ? task : t
        );
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
        this.expiredTasks = data.expired;
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
        this.expiredTasks = data.expired;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateTaskStatus(taskUpdateStatusRequest: TaskUpdateStatusRequest, status: string): void {
    this.taskService.changeTaskStatus(taskUpdateStatusRequest).subscribe({
      next: (task: Task) => {
        if (status === 'completed') {
          this.completedTasks.push(task);
          this.todoTasks = this.todoTasks.filter(
            (t) => t.taskId !== task.taskId
          );
        } else if (status === 'open') {
          this.todoTasks.push(task);
          this.completedTasks = this.completedTasks.filter(
            (t) => t.taskId !== task.taskId
          );
        }
      },
      error: (err: MessageResponse) => {
        console.log(err.message);
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
