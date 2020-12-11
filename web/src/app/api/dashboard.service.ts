/* tslint:disable:no-unused-variable member-ordering */

import {Inject, Injectable, Optional} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

import {BASE_PATH} from '../variables';
import {Configuration} from '../configuration';

import {GenericService} from './generic.service';


@Injectable()
export class DashboardService extends GenericService {

  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    super(httpClient, basePath, configuration);
  }

}
