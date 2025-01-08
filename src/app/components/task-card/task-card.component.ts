import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Task, TaskResponse } from '../../models/task';
import { TokenService } from '../../services/token/token.service';

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
  @Input() task: Task | null = null;
  @Input() cardType: string = '';
  @Output() menuItemClick = new EventEmitter<{ item: string, task: Task | null }>();

  filteredMenuItems: string[] = [];
  isAdmin: boolean = false;

  constructor(private tokenService: TokenService){}

  ngOnInit(): void {
    this.isAdmin = this.tokenService.getPayload()?.isAdmin ?? false;
    this.filteredMenuItems = this.menuItems.filter((item) => {
      if (item === 'Edit' || item === 'Delete' || item === 'Assign To' || item === 'Restore to TODO') {
        return this.isAdmin;
      }
      return true;
    });
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeFlyout(): void {
    this.isMenuOpen = false;
  }

  onMenuItemClick(item: string): void {
    this.menuItemClick.emit({ item, task: this.task });
    this.isMenuOpen = false;
  }
}
