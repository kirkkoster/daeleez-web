import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
})
export class NavigationComponent {
  isOpen = false; // State to track if the menu is open

  constructor(private router: Router) {}

  // Toggle the menu open/close
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  // Close the menu and navigate to the route
  navigateAndClose(route: string) {
    this.router.navigate([route]);
    this.isOpen = false;
  }

  // Close the menu if the user clicks outside
  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.bubble-menu') && this.isOpen) {
      this.isOpen = false;
    }
  }
}