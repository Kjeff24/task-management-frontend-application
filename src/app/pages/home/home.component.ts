import { Component } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenResponse } from '../../models/token-reponse';
import { NewTaskModalComponent } from '../../components/new-task-modal/new-task-modal.component';
import { CommonModule } from '@angular/common';
import { Task, TaskRequest, TaskResponse } from '../../models/task';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskService } from '../../services/task-service/task.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NewTaskModalComponent, TaskCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  
  constructor(
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  code = '';
  isNewTaskModalOpen = false;
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
    if(this.isAdmin) {
      this.taskService.getAllCreatedTasks().subscribe({
        next: (data: TaskResponse) => {
          this.todoTasks = data.open
          this.completedTasks = data.completed
        },
        error: (err) => {
          console.log(err);
        },
      })
    } else {
      this.taskService.getAllTaskByUser().subscribe({
        next: (data: TaskResponse) => {
          this.todoTasks = data.open
          this.completedTasks = data.completed
        },
        error: (err) => {
          console.log(err);
        },
      })
    }
    
  }

  openNewTaskModal() {
    this.isNewTaskModalOpen = true;
  }

  closeModal() {
    this.isNewTaskModalOpen = false;
  }

  addTask(task: TaskRequest) {
    console.log('Task added:', task);
  }

  handleMenuClick(
    section: 'TODO' | 'DONE',
    event: { item: string; task: Task | null }
  ): void {
    if (section === 'TODO') {
      if (event.item === 'Mark as Done') {
        console.log('Marking item as done...');
      }
      if (event.item === 'Edit') {
        this.openNewTaskModal();
        this.taskToUpdate = event.task;
        this.isTaskUpdate = true;
      }
    } else if (section === 'DONE') {
      if (event.item === 'Restore to TODO') {
        console.log('Restoring item to TODO...');
      }
    }
  }
}
