import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserResponse } from '../../models/user';

@Component({
  selector: 'app-assign-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-user.component.html',
  styleUrl: './assign-user.component.css',
})
export class AssignUserComponent {
  @Input() users: UserResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    assignedTo: string;
  }>();
  assignToForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.assignToForm = this.fb.group({
      assignedTo: ['', [Validators.required]],
    });
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.assignToForm.valid) {
      const email = this.assignToForm.get('assignedTo')?.value;
      this.save.emit({ assignedTo: email });
      this.closeModal();
    }
  }
}
