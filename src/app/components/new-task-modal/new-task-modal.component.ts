import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Task, TaskRequest } from '../../models/task';
import { UserResponse } from '../../models/user';
import { deadlineValidator } from '../../utils/validators';

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
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]],
      deadline: ['', [Validators.required, deadlineValidator()]],
    });
  }

  ngOnInit(): void {
    if (this.isTaskUpdate && this.task != null) {
      this.taskForm.patchValue({
        ...this.task
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
