import { Component, EventEmitter, Output } from '@angular/core';
import { UserRequest } from '../../models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserRequest>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required]],
      fullName: ['', [Validators.required]]
    })
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
      if (this.userForm.valid) {
        const userRequest: UserRequest = this.userForm.value;
        this.save.emit(userRequest);
        this.closeModal();
      }
    }

}
