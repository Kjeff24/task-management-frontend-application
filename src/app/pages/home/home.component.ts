import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCommentComponent } from '../../components/add-comment/add-comment.component';
import { AddDeadlineComponent } from '../../components/add-deadline/add-deadline.component';
import { AssignUserComponent } from '../../components/assign-user/assign-user.component';
import { NewTaskModalComponent } from '../../components/new-task-modal/new-task-modal.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { MessageResponse } from '../../models/message';
import {
  AssignToRequest,
  CommentRequest,
  Task,
  TaskCommentRequest,
  TaskRequest,
  TaskResponse,
  TaskUpdateStatusRequest,
} from '../../models/task';
import { TokenResponse } from '../../models/token-reponse';
import { UserResponse } from '../../models/user';
import { TaskService } from '../../services/task-service/task.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NewTaskModalComponent,
    TaskCardComponent,
    AddCommentComponent,
    AddDeadlineComponent,
    AssignUserComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  code = '';
  isNewTaskModalOpen = false;
  isCommentModalOpen = false;
  isDeadlineModalOpen = false;
  isAssignUserModalOpen = false;
  taskToUpdate: Task | null = null;
  taskId: string = '';
  isTaskUpdate: boolean = false;
  todoMenuItems = [
    'Edit',
    'Mark as Done',
    'Add Comment',
    'Assign To',
    'Delete',
  ];
  doneMenuItems = ['Restore to TODO', 'Add Comment', 'Delete'];
  expiredMenuItems = ['Restore to TODO', 'Delete'];
  todoTasks: Task[] = [];
  completedTasks: Task[] = [];
  expiredTasks: Task[] = [];
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

  newTaskModalToggle() {
    this.isNewTaskModalOpen = !this.isNewTaskModalOpen;
  }

  commentModalToggle() {
    this.isCommentModalOpen = !this.isCommentModalOpen;
  }

  deadlineModalToggle() {
    this.isDeadlineModalOpen = !this.isDeadlineModalOpen;
  }

  assignUserModalToggle() {
    this.isAssignUserModalOpen = !this.isAssignUserModalOpen;
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
        this.taskId = event.task.taskId;
      }
      if (event.item === 'Delete' && event.task) {
        this.deleteTask(event.task.taskId);
      }
      if (event.item === 'Assign To' && event.task) {
        this.taskId = event.task.taskId;
        this.assignUserModalToggle();
      }
    } else if (section === 'DONE') {
      if (event.item === 'Restore to TODO' && event.task) {
        const currentTime = new Date();
        const deadline = new Date(event.task.deadline);

        if (deadline.getTime() <= currentTime.getTime() + 5 * 60 * 1000) {
          this.taskId = event.task.taskId;
          this.deadlineModalToggle();
        } else {
          this.changeTaskStatus(event.task?.taskId, 'open');
        }
      }
      if (event.item === 'Add Comment' && event.task) {
        this.commentModalToggle();
        this.taskId = event.task.taskId;
      }
      if (event.item === 'Delete' && event.task) {
        this.deleteTask(event.task.taskId);
      }
    } else if (section === 'EXPIRED') {
      if (event.item === 'Restore to TODO' && event.task) {
        const currentTime = new Date();
        const deadline = new Date(event.task.deadline);

        if (deadline.getTime() <= currentTime.getTime() + 5 * 60 * 1000) {
          this.taskId = event.task.taskId;
          this.deadlineModalToggle();
        } else {
          this.changeTaskStatus(event.task?.taskId, 'open');
        }
      }
      if (event.item === 'Delete' && event.task) {
        this.deleteTask(event.task.taskId);
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

  saveComment(commentRequest: CommentRequest) {
    const comment: TaskCommentRequest = {
      taskId: this.taskId,
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

  saveAssignUser(event: { assignedTo: string }) {
    const assignToRequest: AssignToRequest = {
      taskId: this.taskId,
      assignedTo: event.assignedTo,
    };
    this.reAssignUser(assignToRequest);
  }

  addDeadline(deadline: string) {
    this.changeTaskStatus(this.taskId, 'open', deadline);
  }

  changeTaskStatus(taskId: string, status: string, deadline?: string): void {
    const taskUpdateStatusRequest: TaskUpdateStatusRequest = {
      taskId,
      status,
      deadline: deadline ? deadline : null,
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

  private removeTaskFromLists(taskId: string) {
    [this.todoTasks, this.completedTasks, this.expiredTasks] = [
      this.todoTasks,
      this.completedTasks,
      this.expiredTasks,
    ].map((tasks) => tasks.filter((task) => task.taskId !== taskId));
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

  viewUsers(): void {
    this.router.navigate(['/users']);
  }

  goHome(): void {
    this.router.navigate(['/']);
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

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => this.removeTaskFromLists(taskId),
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  reAssignUser(assignToRequest: AssignToRequest) {
    this.taskService.changeAssignedUser(assignToRequest).subscribe({
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

  updateTaskStatus(
    taskUpdateStatusRequest: TaskUpdateStatusRequest,
    status: string
  ): void {
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
          this.expiredTasks = this.expiredTasks.filter(
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
