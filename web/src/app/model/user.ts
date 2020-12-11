import {SimpleChanges} from '@angular/core';
import {Deserializable} from './deserializable';

export class User implements Deserializable {
  id?: string;
  nameFirst?: string;
  nameLast?: string;
  email?: string;
  password?: string;
  phone?: string;
  customer?: string;
  location?: string;
  contract?: string;
  division?: string;
  jobTitle?: string;
  biography?: string;
  roles?: User.RoleEnum[];

  // audit model
  createdAt?: Date;
  updatedAt?: Date;

  // jwt
  accessToken?: string;
  token?: string;
  tokenType?: string;
  type?: string;

  deserialize(input: any) {
    Object.assign(this, input);
    // TODO: roles
    if (this.roles) {
      console.error('User.deserialize', this.roles);
    }
    return this;
  }
  hasAdminRights(): boolean {
    return this.roles ? this.roles.includes ? this.roles.includes(User.ROLES.Admin) : false : false;
  }
  createFormObject(): any {
    const form: any = this;
    if (form && form.roles) {
      form.roles = form.roles.map(role => {
        if (role.name) {
          return role.name;
        } else {
          return role;
        }
      });
    }
    return form;
  }
  onChanges(changes: SimpleChanges): void {
    // only let roles, contact and additional info change. Not email, password, createdAt, updatedAt
    if (changes && changes.user && changes.user.currentValue) {
      // this.id = changes.user.currentValue.id;;
      this.email = changes.user.currentValue.email;
      // this.password = changes.user.currentValue.password;
      // this.created = changes.user.currentValue.created;
      // this.modified = changes.user.currentValue.modified;
      this.nameFirst = changes.user.currentValue.nameFirst;
      this.nameLast = changes.user.currentValue.nameLast
      this.phone = changes.user.currentValue.phone;
      this.customer = changes.user.currentValue.customer;
      this.location = changes.user.currentValue.location;
      this.contract = changes.user.currentValue.contract;
      this.division = changes.user.currentValue.division;
      this.jobTitle = changes.user.currentValue.jobTitle;
      this.biography = changes.user.currentValue.biography;
      this.roles = changes.user.currentValue.roles; // This is set to any and will not map to RoleEnum (web) or ERole (api)
    }
  }
}

export namespace User {
  export type RoleEnum = 'ROLE_ANONYMOUS' | 'ROLE_REGISTERED' | 'ROLE_AUTHENTICATED' | 'ROLE_MODERATOR' | 'ROLE_LEADERSHIP' |
    'ROLE_ADMIN';
  export const ROLES: { [key: string]: RoleEnum } = {
    Anonymous: 'ROLE_ANONYMOUS' as RoleEnum,
    Registered: 'ROLE_REGISTERED' as RoleEnum,
    Authenticated: 'ROLE_AUTHENTICATED' as RoleEnum,
    Moderator: 'ROLE_MODERATOR' as RoleEnum,
    Leadership: 'ROLE_LEADERSHIP' as RoleEnum,
    Admin: 'ROLE_ADMIN' as RoleEnum,
  };
  export const RESTRICTED_TO_ROLE_MODERATOR: User.RoleEnum[] = [
    User.ROLES.Moderator,
    User.ROLES.Leadership,
  ]
  export const RESTRICTED_TO_ROLE_LEADERSHIP: User.RoleEnum[] = [
    User.ROLES.Leadership,
  ]
}
