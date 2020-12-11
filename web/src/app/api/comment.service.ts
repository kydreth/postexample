import {Inject, Injectable, Optional} from '@angular/core';
import {
    HttpClient,
    HttpResponse,
    HttpEvent
} from '@angular/common/http';

import {Observable} from 'rxjs';

import {BASE_PATH} from '../variables';
import {Configuration} from '../configuration';

import {GenericService} from './generic.service';
import {Post} from '../model/post';
import {Comment} from '../model/comment';

@Injectable()
export class CommentService extends GenericService {

    constructor(
      httpClient: HttpClient,
      @Optional() @Inject(BASE_PATH) basePath: string,
      @Optional() configuration: Configuration
    ) {
        super(httpClient, basePath, configuration);
    }

    /**
     * Add a new comment to a specific post in the portal
     *
     * @param postId
     * @param body comment object that needs to be saved
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */

    public addComment(postId: string, body: Comment, observe ?: 'body', reportProgress ?: boolean): Observable<any>;
    public addComment(postId: string, body: Comment, observe ?: 'response', reportProgress ?: boolean): Observable<HttpResponse<any>>;
    public addComment(postId: string, body: Comment, observe ?: 'events', reportProgress ?: boolean): Observable<HttpEvent<any>>;
    public addComment(postId: string, body: Comment, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        this.defined(body, 'body');
        let headers = this.createHeadersWithDefaults();
        const consumes: string[] = [
            'application/json'
        ];
        headers = this.setHttpHeadersContentTypeSelected(headers, consumes);
        let options = this.getOptions(headers, observe, reportProgress);
        options['body'] = body;
        return this.httpRequestAny('post', `${this.basePath}/post/${postId}/comments`, options);
    }

    /**
     * Get comments for an Post
     * Multiple status values can be provided with comma separated strings
     * @param postId this is the post which we are getting comments from
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCommentsByPostId(postId: string, observe?: 'body', reportProgress?: boolean): Observable<{ [key: string]: string; }>;
    public getCommentsByPostId(postId: string, observe?: 'response', reportProgress?: boolean):
      Observable<HttpResponse<{ [key: string]: string; }>>;
    public getCommentsByPostId(postId: string, observe?: 'events', reportProgress?: boolean):
      Observable<HttpEvent<{ [key: string]: string; }>>;
    public getCommentsByPostId(postId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        this.defined(postId, 'postId');
        const headers = this.createHeadersWithDefaults();
        let options = this.getOptions(headers, observe, reportProgress);
        options['postId'] = postId;
        return this.httpClient.request<{ [key: string]: string; }>('get', `${this.basePath}/post/${postId}/comments`, options);
    }
}
