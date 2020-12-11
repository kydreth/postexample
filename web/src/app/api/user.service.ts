import {Inject, Injectable, Optional} from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpParams,
  HttpResponse, HttpEvent
} from '@angular/common/http';
import {CustomHttpUrlEncodingCodec} from '../encoder';

import {Observable} from 'rxjs';

import {User} from '../model/user';

import {BASE_PATH} from '../variables';
import {Configuration} from '../configuration';
import {GenericService} from './generic.service';

@Injectable()
export class UserService extends GenericService {

  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    super(httpClient, basePath, configuration);
  }

  /**
   * Create user
   * This can only be done by the logged in user.
   * @param body Created user object
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public createUser(body: User, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public createUser(body: User, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public createUser(body: User, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public createUser(body: User, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(body, 'body');
    let headers = this.createHeadersWithDefaults();
    const consumes: string[] = [
      'application/json'
    ];
    headers = this.setHttpHeadersContentTypeSelected(headers, consumes);
    let options = this.getOptions(headers, observe, reportProgress);
    options['body'] = body;
    return this.httpRequestAny('post', `${this.basePath}/user/`, options);
  }

  /**
   * Delete user
   * This can only be done by the logged in user.
   * @param username The name that needs to be deleted
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteUser(username: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public deleteUser(username: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public deleteUser(username: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public deleteUser(username: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(username, 'username');
    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpRequestAny('delete', `${this.basePath}/user/${encodeURIComponent(String(username))}`, options);
  }

  /**
   * Get user by user name
   *
   * @param email The users email that needs to be fetched.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getUserByEmail(email: string, observe?: 'body', reportProgress?: boolean): Observable<User>;
  public getUserByEmail(email: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<User>>;
  public getUserByEmail(email: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<User>>;
  public getUserByEmail(email: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(email, 'email');
    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpClient.request<User>('get', `${this.basePath}/user/by/email${encodeURIComponent(String(email))}`, options);
  }

  /**
   * Get user by user id
   *
   * @param userId The name that needs to be fetched.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getUserById(userId: string, observe?: 'body', reportProgress?: boolean): Observable<User>;
  public getUserById(userId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<User>>;
  public getUserById(userId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<User>>;
  public getUserById(userId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(userId, 'userId');
    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpClient.request<User>('get', `${this.basePath}/user/by/id${encodeURIComponent(String(userId))}`, options);
  }

  /**
   * Logs user into the system
   *
   * @param username The user name for login
   * @param password The password for login in clear text
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public loginUser(username: string, password: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
  public loginUser(username: string, password: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
  public loginUser(username: string, password: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
  public loginUser(username: string, password: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(username, 'username');
    this.defined(password, 'password');
    let headers = this.createHeadersWithDefaults();
    const consumes: string[] = [
      'application/json'
    ];
    headers = this.setHttpHeadersContentTypeSelected(headers, consumes);
    let options = this.getOptions(headers, observe, reportProgress);

    let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
    if (username !== undefined && username !== null) {
      queryParameters = queryParameters.set('username', <any>username);
    }
    if (password !== undefined && password !== null) {
      queryParameters = queryParameters.set('password', <any>password);
    }
    options['params'] = queryParameters;

    return this.httpClient.request<string>('get', `${this.basePath}/user/login`, options);
  }

  /**
   * Logs out current logged in user session
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public logoutUser(observe?: 'body', reportProgress?: boolean): Observable<any>;
  public logoutUser(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public logoutUser(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public logoutUser(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    let headers = this.createHeadersWithDefaults();
    const consumes: string[] = [
      'application/json'
    ];
    headers = this.setHttpHeadersContentTypeSelected(headers, consumes);
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpRequestAny('get', `${this.basePath}/user/logout`, options);
  }

  /**
   * Updated user
   * This can only be done by the logged in user.
   * @param body Updated user object
   * @param username name that need to be updated
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateUser(body: User, username: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public updateUser(body: User, username: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public updateUser(body: User, username: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public updateUser(body: User, username: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling updateUser.');
    }

    if (username === null || username === undefined) {
      throw new Error('Required parameter username was null or undefined when calling updateUser.');
    }

    this.defined(body, 'body');
    this.defined(username, 'username');
    let headers = this.createHeadersWithDefaults();
    const consumes: string[] = [
      'application/json'
    ];
    headers = this.setHttpHeadersContentTypeSelected(headers, consumes);
    let options = this.getOptions(headers, observe, reportProgress);
    options['body'] = body;
    return this.httpRequestAny('put', `${this.basePath}/user/${encodeURIComponent(String(username))}`, options);
  }

  /**
   * Returns users by all users, restricted to leadership and admin roles
   * Returns an pageable list of users
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getUserList(observe?: 'body', reportProgress?: boolean): Observable<{ [key: string]: string; }>;
  public getUserList(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: string; }>>;
  public getUserList(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: string; }>>;
  public getUserList(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpClient.request<{ [key: string]: string; }>('get', `${this.basePath}/user/list`, options);
  }
}
