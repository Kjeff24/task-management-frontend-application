import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentRequest } from '../../models/task';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CommentRequest>();

  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]]
    })
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
      if (this.commentForm.valid) {
        const userRequest: CommentRequest = this.commentForm.value;
        this.save.emit(userRequest);
        this.closeModal();
      }
    }

}
