import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { TaskResponse } from '../../models/task';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  isMenuOpen = false;
  @Input() menuItems: string[] = [];
  @Output() menuItemClick = new EventEmitter<string>();

  userRole: 'admin' | 'user' = 'admin';



  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeFlyout(): void {
    this.isMenuOpen = false;
  }

  onMenuItemClick(item: string): void {
    this.menuItemClick.emit(item);
    this.isMenuOpen = false;
  }
}
