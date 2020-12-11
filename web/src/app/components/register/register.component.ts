import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../api/auth.service';
import {Router} from '@angular/router';
import {User} from '../../model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
// TODO: use angular FormControl
export class RegisterComponent implements OnInit {

  form: User;
  isSuccessful = false
  isRegistrationFailed = false
  errorMessage = ''

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    if (this.userLoggedIn()) {
      this.router.navigate(['/posts/authored']);
    } else {
      this.form = new User();
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.register(this.form).subscribe(
      data => {
        this.isSuccessful = true
        this.isRegistrationFailed = false
      },
      err => {
        this.errorMessage = err.error.message
        this.isRegistrationFailed = true
      }
    )
  }

  userLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }
}
