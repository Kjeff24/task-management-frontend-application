import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { deadlineValidator } from '../../utils/validators';

@Component({
  selector: 'app-add-deadline',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-deadline.component.html',
  styleUrl: './add-deadline.component.css'
})
export class AddDeadlineComponent {

  @Output() close = new EventEmitter<void>();
  @Output() addDeadline = new EventEmitter<string>();
  deadlineForm: FormGroup;

  constructor(
      private fb: FormBuilder
    ) {
      this.deadlineForm = this.fb.group({
        deadline: ['', [Validators.required, deadlineValidator()]]
      });
    }

    closeModal() {
        this.close.emit();
      }
    
      onSubmit() {
        if (this.deadlineForm.valid) {
          this.addDeadline.emit(this.deadlineForm.get('deadline')?.value);
          this.closeModal();
        }
      }
}
