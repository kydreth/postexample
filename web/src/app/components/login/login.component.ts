import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../api/session-storage.service';
import {AuthService} from '../../api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
  ) {
    if (this.userLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.authService.getUser().roles;
      this.router.navigate(['/posts/authored']);
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.form)
      .subscribe(
        data => {
          this.sessionStorageService.signOut();
          this.sessionStorageService.saveToken(data.accessToken);
          this.sessionStorageService.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.authService.getUser().roles;
          document.location.href = '/';
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
          // this.router.navigate(['/register']);
        }
      );
  }

  userLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  goToRegistration(): void {
    this.router.navigate(['/register'])
  }
}
