import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {AuthService, PostService} from '../../api';
import {Post} from '../../model'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})

/**
 * PostComponent which holds the basic input for a new post.
 * Also displays some variation depending on whether in view or edit modes.
 * This is controlled through the edit/view booleans which is based on the current route
 */
export class PostComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  post: Post;
  postId: string;
  add: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
  title: string;

  constructor(
    private _ngZone: NgZone,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
  ) {
    if (!this.authService.isUserLoggedIn()) {
      this.router.navigate(['/register']);
    }
  }

  triggerResize(event: KeyboardEvent) {
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => {
        this.autosize.resizeToFitContent(true);
      });
  }

  ngOnInit() {
    this.clearPost();
    this.postId = this.route.snapshot.paramMap.get('id');
    this.edit = this.router.url.includes('edit');
    this.view = this.router.url.includes('view');
    this.delete = this.router.url.includes('delete');
    if (!this.edit && !this.view && !this.delete) {
      this.add = true;
    }
    this.setTitle();
    if (this.postId) {
      if (this.edit || this.view) {
        this.postService.getPostById(this.postId)
          .subscribe((data) => {
            this.post = Object.assign(new Post, data);
          });
      } else if (this.delete) {
        this.postService.deletePost(this.postId)
          .subscribe((data) => {
            this.goToPosts();
          });
      }
    }
  }

  /**
   * Submits a new Post to the backend
   */
  onSubmit() {
    if (this.post.id === undefined) {
      this.postService.addPost(this.post)
        .subscribe((post: Observable<any>) => {
          this.openSnackBar('Post Submitted Successfully!', '');
          this.goToPosts();
        });
    } else {
      this.postService.updatePost(this.post)
        .subscribe((post: Observable<any>) => {
          this.openSnackBar('Post Updated Successfully!', '');
        });
    }
  }

  readOnly(): boolean {
    return this.view;
  }

  goToPosts(): void {
    this.router.navigate([`/posts/authored`]);
  }

  setTitle(): void {
    if (this.edit) {
      this.title = 'Edit Post';
    } else if (this.view) {
      this.title = 'View Post';
    } else if (this.delete) {
      this.title = 'Delete Post';
    } else {
      this.title = 'Add Post';
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(
      message,
      action, {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['mat-toolbar', 'mat-primary', 'simple-snack-bar']
      });
  }

  /**
   * Resets the current form to have all fields be empty
   */
  clearPost() {
    this.post = new Post();
  }
}
