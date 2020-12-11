import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';

const AUTH_API = environment.api_url

@Component({
  selector: 'app-verification',
  template: ''
})
export class VerificationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.v)
      .subscribe(params => {
          console.log(params); // { verificationString: "uuid" }

          this.http.post<any>(AUTH_API + '/user/verification', {verificationString: params.v}).subscribe({
            next: data => {
              this.router.navigate(['/login']);
            },
            error: error => {
              console.error('There was an error!', error);
            }
          })
        }
      );
  }
}
