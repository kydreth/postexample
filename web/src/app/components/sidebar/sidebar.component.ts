import {Component, ElementRef, OnInit} from '@angular/core';
import {AuthService} from '../../api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(
    private element: ElementRef,
    private authService: AuthService,
  ) {
    this.setMenuItems();
  }

  ngOnInit(): void { }

  isMobileMenu(): boolean {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

  userLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  setMenuItems(): void {
    this.menuItems = this.authService.getRoutesForCurrentSession();
  }
}
