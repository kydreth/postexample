import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../model';
import {AuthService, UserService} from '../../api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  selectedUser: User;
  loggedInUser: User;
  private params: any = {
    id: null as string,
    email: null as string,
    edit: null as boolean,
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    if (!this.authService.isUserLoggedIn()) {
      this.router.navigate(['/register']);
    }
    this.loggedInUser = this.authService.getUser();
    this.params.id = this.route.snapshot.paramMap.get('id');
    this.params.email = this.route.snapshot.paramMap.get('email');
    this.params.edit = this.router.url.includes('edit');
  }

  ngOnInit(): void {
    if (this.loggedInUser.id === this.getParamId() || this.getParamId() === null) {
      this.setSelectedUser(this.loggedInUser);
    } else if (this.getParamId() !== null) {
      console.log('param id not null', this.getParamId());
      this.userService
        .getUserById(this.getParamId())
        .subscribe((data) => {
          console.log(data);
        });
    } else if (this.getParamEmail() !== null) {
      console.log('param email not null', this.getParamEmail());
      this.userService
        .getUserByEmail(this.getParamEmail())
        .subscribe((data) => {
          console.log(data);
        });
    }
  }

  setSelectedUser(user: User) {
    this.selectedUser = user;
  }

  getParamId(): string {
    return this.params.id;
  }

  getParamEmail(): string {
    return this.params.email;
  }

  isReadOnly(): boolean {
    return !this.params.edit;
  }
}
