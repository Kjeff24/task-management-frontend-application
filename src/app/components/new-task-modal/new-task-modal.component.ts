import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaskService } from '../../services/task-service/task.service';
import { Task, TaskRequest, TaskResponse } from '../../models/task';
import { convertDateToISOFormat } from '../../utils/date-utils';
import { UserService } from '../../services/user-service/user.service';
import { MessageResponse } from '../../models/message';
import { UserResponse } from '../../models/user';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-task-modal.component.html',
  styleUrl: './new-task-modal.component.css',
  providers: [DatePipe],
})
export class NewTaskModalComponent {
  @Input() task: Task | null = null;
  @Input() isTaskUpdate: boolean = false;
  @Input() users: UserResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    task: TaskRequest;
    taskId: string;
  }>();
  taskForm: FormGroup;
  taskId: string = '';

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]],
      deadline: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.isTaskUpdate && this.task != null) {
      const convertedDeadline = convertDateToISOFormat(
        this.task.deadline,
        this.datePipe
      );
      this.taskForm.patchValue({
        ...this.task,
        deadline: convertedDeadline,
      });
      this.taskId = this.task.taskId;
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskRequest: TaskRequest = this.taskForm.value;
      this.save.emit({ task: taskRequest, taskId: this.taskId });
      this.closeModal();
    }
  }

}
