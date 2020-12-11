import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../api/auth.service';
import {User} from '../..';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  private body: any;
  private sidebarVisible: boolean;
  private close_layer: any;
  private timeout_sidebar: any;
  private timeout_$layer: any;
  private user: User;

  constructor(
    location: Location,
    private element: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.location = location;
    this.sidebarVisible = false;
    this.setListTitles();
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.body = document.getElementsByTagName('body')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {}

  getToggleButton(): any {
    return this.element.nativeElement.getElementsByClassName('navbar-toggler')[0];
  }

  ifSidebarTimeoutExists(): void {
    if (this.timeout_sidebar !== null) {
      clearTimeout(this.timeout_sidebar);
    }
  }

  sidebarOpen() {
    const body = this.body;
    const toggleButton = this.getToggleButton();

    this.ifSidebarTimeoutExists();
    this.timeout_sidebar = setTimeout(function() {
      toggleButton.classList.add('toggled');
      body.classList.add('nav-open');

      this.createCloseLayer();
    }.bind(this), 100);

    this.sidebarVisible = true;
  };

  sidebarClose() {
    const body = this.body;
    const toggleButton = this.getToggleButton();

    this.ifSidebarTimeoutExists();
    this.timeout_sidebar = setTimeout(function() {
      toggleButton.classList.remove('toggled');
      body.classList.remove('nav-open');

      this.removeCloseLayer();
    }.bind(this), 100);

    this.sidebarVisible = false;
  };

  sidebarToggle(): void { // mobile menu button clicked
    if (this.sidebarVisible) {
      this.sidebarClose();
    } else {
      this.sidebarOpen();
    }
  }

  ifLayerTimeoutExists(): void {
    if (this.timeout_$layer !== null) {
      clearTimeout(this.timeout_$layer);
    }
  }

  createCloseLayer(): void {
    const body = this.body;

    if (this.close_layer === null || this.close_layer === undefined) {
      this.close_layer = document.createElement('div');
      this.close_layer.setAttribute('class', 'close-layer');

      this.close_layer.onclick = function() {
        this.getCloseLayer().classList.remove('visible');
        this.ifLayerTimeoutExists();
        this.timeout_$layer = setTimeout(function() {
          this.sidebarClose();
        }.bind(this), 100);
      }.bind(this);

      if (body.querySelectorAll('.main-panel')) { // mobile menu toggled open
        document.getElementsByClassName('main-panel')[0].appendChild(this.getCloseLayer());
      }

      this.ifLayerTimeoutExists();
      this.timeout_$layer = setTimeout(function() {
        this.getCloseLayer().classList.add('visible');
      }.bind(this), 100);
    }
  }

  getCloseLayer(): any {
    return this.close_layer;
  }

  removeCloseLayer(): void {
    if (this.close_layer !== null && this.close_layer !== undefined) {
      this.close_layer.remove();
      this.close_layer = null;
    }
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }

  register() {
    this.router.navigate(['/register']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  getUserEmail(): string {
    return this.user ? this.user.email ? this.user.email : null : null;
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return '';
  }

  setListTitles(): void {
    this.listTitles = this.authService.getRoutesForCurrentSession();
  }

  userLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }
}
