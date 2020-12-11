import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../model';
import {AuthService, UserService} from '../../api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any;
  user: User;
  canEdit: boolean;
  loggedInUser: User;
  selectedUser: User;
  loggedInUserIsAnAdmin: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
  ) {

    this.loggedInUser = this.authService.getUser();
    if (!this.loggedInUser.roles) {
      this.redirect();
    }
    this.loggedInUserIsAnAdmin = this.authService.getUser().hasAdminRights();
    if (!this.loggedInUserIsAnAdmin) {
      this.redirect();
    }

    this.userService
      .getUserList()
      .subscribe((data) => {
        this.setUsersFromPageable(data);
      });
  }

  ngOnInit(): void { }

  setUsersFromPageable(data: any): void {
    this.users = Object.assign([], data.content).map(item => {
      return Object.assign(new User, item);
    });
  }

  setSelectedUser(user: User) {
    this.selectedUser = user;
  }

  redirect(): void {
    this.router.navigate(['/posts/authored']);
  }
}
