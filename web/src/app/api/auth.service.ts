import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {SessionStorageService} from './session-storage.service';
import {User} from '../model';

const AUTH_API = environment.api_url

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

declare interface RouteInfo {
  order: number,
  path: string,
  title: string,
  icon: string,
  class: string,
  isLoggedIn: boolean,
  isRestricted: boolean,
  isRestrictedToRoles?: User.RoleEnum[],
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private routes_indexed_by_path: { [key: string]: RouteInfo };
  private routes: RouteInfo[];

  /**
   * Constructor of AuthService
   * @param http
   * @param sessionStorageService
   * @param router
   */
  constructor(
    private http: HttpClient,
    private sessionStorageService: SessionStorageService,
    private router: Router,
  ) {
    this.initializeRoutes();
  }
  /**
   * USERS
   */
  public isUserLoggedIn(): boolean {
    const token: string = this.sessionStorageService.getToken();
    return token !== null && token !== undefined;
  }

  public getUser(): User {
    return Object.assign(new User, this.sessionStorageService.getUserKey());
  }

  public login(credentials): Observable<any> {
    this.sessionStorageService.signOut();
    return this.http.post(AUTH_API + '/user/login', {
      email: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  public logout(): void {
    this.sessionStorageService.signOut();
    if (this.router.url === '/login') {
      location.reload();
    } else {
      this.router.navigate(['/login']).then(r => {
        this.http.post(AUTH_API + '/user/logout', {
          user: this.getUser()
        }, httpOptions);
      });
    }
  }

  // TODO: move to user service
  public register(user): Observable<any> {
    return this.http.post(AUTH_API + '/user/', user, httpOptions);
  }

  // TODO: move to user service
  public update(user): Observable<any> {
    return this.http.post(AUTH_API + '/user/update', user, httpOptions);
  }

  /**
   * ROUTES
   */
  private initializeRoutes(): void {
    this.routes_indexed_by_path = {
      // anonymous users
      '/login': {order: 10, path: '/login', title: 'Login', icon: 'login', class: '', isLoggedIn: false,
        isRestricted: false},
      '/register': {order: 15, path: '/register', title: 'Register', icon: 'person', class: '', isLoggedIn: false,
        isRestricted: false},

      // logged-in users
      '/profile': {order: 20, path: '/profile', title: 'My Profile',  icon: 'person', class: '', isLoggedIn: true,
        isRestricted: false},
      '/post': {order: 30, path: '/post', title: 'Post', icon: 'emoji_objects', class: '', isLoggedIn: true,
        isRestricted: false},
      '/posts/authored': {order: 40, path: '/posts/authored', title: 'Manage My Posts', icon: 'batch_prediction', class: '',
        isLoggedIn: true, isRestricted: false},

      // logged-in users with specific roles
      '/posts/all': {order: 50, path: '/posts/all', title: 'Manage All Posts', icon: 'batch_prediction', class: '', isLoggedIn: true,
        isRestricted: true, isRestrictedToRoles: User.RESTRICTED_TO_ROLE_LEADERSHIP
      },
      '/users': {order: 60, path: '/users', title: 'Manage Users', icon: 'group', class: '', isLoggedIn: true,
        isRestricted: true, isRestrictedToRoles: [User.ROLES.Admin]
      },
      // '/dashboard': {order: 80, path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', isLoggedIn: true,
      //   isRestricted: true, isRestrictedToRoles: User.RESTRICTED_TO_ROLE_LEADERSHIP
      // },
    }
    this.routes = [];
    let path: string;
    for (path in this.routes_indexed_by_path) {
      if (this.routes_indexed_by_path.hasOwnProperty(path)) {
        const route: RouteInfo = this.routes_indexed_by_path[path];
        this.routes.push(route);
      }
    }
  }

  private loggedInUserHasRoleForRestrictedRoute(route: RouteInfo): boolean {
    if (route) {
      if (route.isRestricted) {
        let result = false;
        route.isRestrictedToRoles.some(route_role => {
          if (this.getUser().roles.includes(route_role)) {
            result = true;
          }
        });
        return result;
      } else {
        return true;
      }
    }
    return null;
  }

  getRouteForPath(path: string): RouteInfo {
    return this.routes_indexed_by_path[path] || null;
  }

  public getRoutesForCurrentSession(): RouteInfo[] {
    return this.routes.filter(route => {
      if (this.isUserLoggedIn()) { // logged-in
        if (route.isLoggedIn && this.loggedInUserHasRoleForRestrictedRoute(route)) {
          return route;
        }
      } else if (!route.isLoggedIn) { // anonymous
        return route;
      }
    });
  }

  loggedInUserAuthorizedForPath(path: string): boolean {
    const route = this.getRouteForPath(path);
    if (this.isUserLoggedIn() && route && route.isLoggedIn) { // logged-in
      return this.loggedInUserHasRoleForRestrictedRoute(route);
    } else {
      return false;
    }
  }
}
