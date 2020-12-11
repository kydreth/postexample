import {Inject, Injectable, Optional} from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpParams,
  HttpResponse, HttpEvent, HttpErrorResponse
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';

import {BASE_PATH} from '../variables';
import {Configuration} from '../configuration';

import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable()
export class GenericService {

  protected basePath = environment.api_url;
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * Uses the openSnackBar function to display a warning
   * @param error HttpErrorResponse
   * @return Observable
   */
  showErrorNotification(error: HttpErrorResponse): Observable<never> {
    console.error(HttpErrorResponse);
    return throwError('post.service error!')
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   * Given parameter is not null or undefined
   */
  defined(param: any, name: string): any {
    if (param === null || param === undefined) {
      return new Error(`Required parameter ${name} was null or undefined when calling defined`);
    }
  }

  /**
   * @return HttpHeaders
   */
  createHeadersWithDefaults(): HttpHeaders {
    let headers = this.defaultHeaders;

    if (this.configuration.accessToken) {
      const accessToken = typeof this.configuration.accessToken === 'function'
        ? this.configuration.accessToken()
        : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }

    // optionally set api_key here for all api requests

    const httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    return headers;
  }

  /**
   * Given parameter HTTP headers from this.defaultHeaders|HttpHeaders, <msg>
   * @param headers HttpHeaders
   */
  setHttpHeadersContentTypeSelected(headers: HttpHeaders, consumes: string[]): HttpHeaders {
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }
    return headers;
  }

  /**
   * Get options for HTTP request
   * @param headers
   */
  getOptions(headers: HttpHeaders, observe: string, reportProgress: boolean): any {
    return {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    }
  }

  /**
   *
   */
  httpRequestAny(method: string, path: string, options: any): any {
    return this.httpClient.request<any>(method, `${path}`,
        options
      ).pipe(
        catchError(this.showErrorNotification)
      );
  }
}
