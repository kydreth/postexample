import {Component, Input, OnInit, OnChanges, SimpleChanges, NgZone, ViewChild} from '@angular/core';
import {User} from '../../model';
import {AuthService} from '../../api';
import {MatSnackBar} from '@angular/material/snack-bar';
import {take} from 'rxjs/operators';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnChanges {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input() displayUser: User;
  @Input() readOnly: boolean;
  @Input() cardTitle: string;
  roles = User.ROLES;
  isSuccessful = false;
  loggedInUserIsAnAdmin: boolean;

  constructor(
    private _ngZone: NgZone,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
    this.displayUser = new User();
    this.loggedInUserIsAnAdmin = this.authService.getUser().hasAdminRights();
  }

  triggerResize(event: KeyboardEvent) {
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => {
        this.autosize.resizeToFitContent(true);
      });
  }

  ngOnInit() { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(
      message,
      action, {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary', 'simple-snack-bar']
      });
  }

  onSubmit(): void {
    this.authService.update(this.displayUser.createFormObject()).subscribe(
      data => {
        this.isSuccessful = true;
        this.openSnackBar('User Updated Successfully!', '');
      },
      err => {
        console.error(err.error.message, err);
        this.openSnackBar('Unable to update user, please review form!', '');
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.displayUser && this.displayUser.onChanges && changes.displayUser.currentValue) {
      this.displayUser.onChanges(changes);
    } else if (changes.displayUser.currentValue) {
      this.displayUser = Object.assign(new User, changes.displayUser.currentValue);
    }
  }

  compareRoles(roleOption: any, roleValue: any) {
    if (roleOption && roleValue) {
      return roleOption === (roleValue.name ? roleValue.name : roleValue);
    } else {
      return false;
    }
  }

  isReadOnly(): boolean {
    // @ts-ignore
    return this.readOnly === null ? false : (this.readOnly === true || this.readOnly === 'true');
  }
}
