import {Inject, Injectable, Optional} from '@angular/core';
import {
  HttpClient, HttpParams,
  HttpResponse, HttpEvent
} from '@angular/common/http';
import {CustomHttpUrlEncodingCodec} from '../encoder';

import {Observable} from 'rxjs';

import {ApiResponse} from '../model/apiResponse';
import {Post} from '../model/post';

import {BASE_PATH} from '../variables';
import {Configuration} from '../configuration';

import {GenericService} from './generic.service';


@Injectable()
export class PostService extends GenericService {

  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    super(httpClient, basePath, configuration);
  }

  /**
   * Add a new post to the portal
   *
   * @param body Post object that needs to be saved
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public addPost(body: Post, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public addPost(body: Post, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public addPost(body: Post, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public addPost(body: Post, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(body, 'body');
    let headers = this.createHeadersWithDefaults();
    const consumes: string[] = [
      'application/json'
    ];
    headers = this.setHttpHeadersContentTypeSelected(headers, consumes);
    const options = this.getOptions(headers, observe, reportProgress);
    options['body'] = body;
    return this.httpRequestAny('post', `${this.basePath}/post/`, options);
  }

  /**
   * Deletes a post
   *
   * @param postId post id to delete
   * @param apiKey
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deletePost(postId: string, apiKey?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public deletePost(postId: string, apiKey?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public deletePost(postId: string, apiKey?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public deletePost(postId: string, apiKey?: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(postId, 'postId');
    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    options['postId'] = postId;
    return this.httpRequestAny('delete', `${this.basePath}/post/${encodeURIComponent(String(postId))}`, options);
  }

  /**
   * Finds Posts by status
   * Multiple status values can be provided with comma separated strings
   * @param status Status values that need to be considered for filter
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public findPostsByStatus(status: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<Array<Post>>;
  public findPostsByStatus(status: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Post>>>;
  public findPostsByStatus(status: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Post>>>;
  public findPostsByStatus(status: Array<string>, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(status, 'status');
    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);

    let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
    if (status) {
      status.forEach((element) => {
        queryParameters = queryParameters.append('status', <any>element);
      })
    }
    options['params'] = queryParameters;

    return this.httpClient.request<Array<Post>>('get', `${this.basePath}/post/findByStatus`, options);
  }

  /**
   * Finds Posts by tags
   * Muliple tags can be provided with comma separated strings. Use\\ \\ tag1, tag2, tag3 for testing.
   * @param tags Tags to filter by
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public findPostsByTags(tags: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<Array<Post>>;
  public findPostsByTags(tags: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Post>>>;
  public findPostsByTags(tags: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Post>>>;
  public findPostsByTags(tags: Array<string>, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(tags, 'tags');
    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);

    let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
    if (tags) {
      tags.forEach((element) => {
        queryParameters = queryParameters.append('tags', <any>element);
      })
    }
    options['params'] = queryParameters;

    return this.httpClient.request<Array<Post>>('get', `${this.basePath}/post/findByTags`, options);
  }

  /**
   * Find post by ID
   * Returns a single post
   * @param postId ID of post to return
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getPostById(postId: string, observe?: 'body', reportProgress?: boolean): Observable<Post>;
  public getPostById(postId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Post>>;
  public getPostById(postId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Post>>;
  public getPostById(postId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(postId, 'postId');
    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpClient.request<Post>('get', `${this.basePath}/post/${encodeURIComponent(String(postId))}`, options);
  }

  /**
   * Returns posts by current user that they authored
   * Returns an pageable list of posts
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getPostListAuthored(observe?: 'body', reportProgress?: boolean): Observable<{ [key: string]: string; }>;
  public getPostListAuthored(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: string; }>>;
  public getPostListAuthored(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: string; }>>;
  public getPostListAuthored(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpClient.request<{ [key: string]: string; }>('get', `${this.basePath}/post/list/authored`, options);
  }

  /**
   * Returns posts by given user, restricted to leadership and admin roles
   * Returns an pageable list of posts
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getPostListByUser(userId: string, observe?: 'body', reportProgress?: boolean): Observable<{ [key: string]: string; }>;
  public getPostListByUser(userId: string, observe?: 'response', reportProgress?: boolean):
    Observable<HttpResponse<{ [key: string]: string; }>>;
  public getPostListByUser(userId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: string; }>>;
  public getPostListByUser(userId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(userId, 'userId');
    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    options['userId'] = userId;
    return this.httpClient.request<{ [key: string]: string; }>('get', `${this.basePath}/post/list/user/${encodeURIComponent(String(userId))}`, options);
  }

  /**
   * Returns posts by all users, restricted to leadership and admin roles
   * Returns an pageable list of posts
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getPostList(observe?: 'body', reportProgress?: boolean): Observable<{ [key: string]: string; }>;
  public getPostList(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: string; }>>;
  public getPostList(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: string; }>>;
  public getPostList(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpClient.request<{ [key: string]: string; }>('get', `${this.basePath}/post/list`, options);
  }

  /**
   * Update an existing post
   *
   * @param body Post object that needs to be saved
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updatePost(body: Post, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public updatePost(body: Post, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public updatePost(body: Post, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public updatePost(body: Post, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(body, 'body');
    let headers = this.createHeadersWithDefaults();
    const consumes: string[] = [
      'application/json'
    ];
    headers = this.setHttpHeadersContentTypeSelected(headers, consumes);
    const options = this.getOptions(headers, observe, reportProgress);
    options['body'] = body;
    return this.httpRequestAny('put', `${this.basePath}/post/${encodeURIComponent(String(body.id))}`, options);
  }

  /**
   * uploads a file
   *
   * @param postId ID of post to update
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public uploadFile(postId: string, body?: Object, observe?: 'body', reportProgress?: boolean): Observable<ApiResponse>;
  public uploadFile(postId: string, body?: Object, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ApiResponse>>;
  public uploadFile(postId: string, body?: Object, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ApiResponse>>;
  public uploadFile(postId: string, body?: Object, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    this.defined(postId, 'postId');
    let headers = this.createHeadersWithDefaults();
    const consumes: string[] = [
      'application/octet-stream'
    ];
    headers = this.setHttpHeadersContentTypeSelected(headers, consumes);
    const options = this.getOptions(headers, observe, reportProgress);
    options['postId'] = postId;
    options['body'] = body;
    return this.httpClient.request<ApiResponse>('post',
      `${this.basePath}/post/${encodeURIComponent(String(postId))}/uploadFile`, options);
  }

  /**
   * Aggregate Posts By User
   * Multiple status values can be provided with comma separated strings
   * @param status Status values that need to be considered for filter
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public aggregatePostsByUser(observe?: 'body', reportProgress?: boolean): Observable<{ [key: string]: string; }>;
  public aggregatePostsByUser(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<{ [key: string]: string; }>>;
  public aggregatePostsByUser(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<{ [key: string]: string; }>>;
  public aggregatePostsByUser(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    const headers = this.createHeadersWithDefaults();
    const options = this.getOptions(headers, observe, reportProgress);
    return this.httpClient.request<{ [key: string]: string; }>('get', `${this.basePath}/post/aggregate/by/user`, options);
  }
}
