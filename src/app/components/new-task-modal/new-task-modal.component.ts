import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task-service/task.service';
import { TaskRequest, TaskResponse } from '../../models/task';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-task-modal.component.html',
  styleUrl: './new-task-modal.component.css'
})
export class NewTaskModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TaskRequest>();
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]],
      deadline: ['', [Validators.required]]
    });
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskRequest: TaskRequest = this.taskForm.value;
      this.taskService.createTask(taskRequest).subscribe({
        next : (task: TaskResponse) => {
          console.log('Task created successfully:', task);
          this.save.emit(taskRequest);
          this.closeModal();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
        }
      });
    }
  }
}
