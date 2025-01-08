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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NewTaskModalComponent, TaskCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
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

  constructor(
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.code = data['code'];
      if (this.code) {
        this.getToken(this.code);
      }
    });

    // Test Data: Remove after getting response from api
    this.todoTasks = [
      {
        taskId: '1',
        name: 'Design Landing Page',
        description: 'Create a responsive design for the landing page.',
        userComment: 'Need it done by Friday.',
        assignedTo: 'Alice',
        status: 'TODO',
        createdBy: 'John',
        deadline: '05 Jan 2025 14:30',
        completedAt: '',
        hasSentDeadlineNotification: 'false',
      },
      {
        taskId: '2',
        name: 'Fix Login Bug',
        description: 'Resolve issue with user login API.',
        userComment: 'Critical bug affecting production.',
        assignedTo: 'Bob',
        status: 'TODO',
        createdBy: 'Alice',
        deadline: '05 Jan 2025 14:30',
        completedAt: '',
        hasSentDeadlineNotification: 'true',
      },
    ];

    this.completedTasks = [
      {
        taskId: '3',
        name: 'Setup Database',
        description: 'Configure database for the project.',
        userComment: '',
        assignedTo: 'Alice',
        status: 'COMPLETED',
        createdBy: 'John',
        deadline: '05 Jan 2025 14:30',
        completedAt: '05 Jan 2025 14:30',
        hasSentDeadlineNotification: 'false',
      },
      {
        taskId: '4',
        name: 'Deploy Backend',
        description: 'Deploy backend services to AWS.',
        userComment: 'Deployed successfully.',
        assignedTo: 'Bob',
        status: 'COMPLETED',
        createdBy: 'Alice',
        deadline: '05 Jan 2025 14:30',
        completedAt: '05 Jan 2025 14:30',
        hasSentDeadlineNotification: 'true',
      },
    ];
  }

  login(): void {
    let params = new HttpParams()
      .set('response_type', environment.response_type)
      .set('client_id', environment.client_id)
      .set('redirect_uri', environment.redirect_uri);

    location.href = environment.login_endpoint + '?' + params;
  }

  getToken(code: string): void {
    this.tokenService.getToken(this.code).subscribe({
      next: (data: TokenResponse) => {
        this.tokenService.setTokens(data.id_token);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
