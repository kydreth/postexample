import {Component, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CommentService} from '../../api/comment.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionStorageService} from '../../api/session-storage.service';
import {Post, Comment} from '../../model';
import {AuthService} from '../../api';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnChanges {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input() selectedPost: Post;
  comment: Comment;
  comments: Comment[];

  constructor(
    private _ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService,
  ) {
    if (!this.authService.isUserLoggedIn()) {
      this.router.navigate(['/register']);
    }
    this.selectedPost = null;
  }

  triggerResize(event: KeyboardEvent) {
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => {
        this.autosize.resizeToFitContent(true);
      });
  }

  ngOnInit(): void {
    this.resetComment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.selectedPost.isFirstChange()) {
      this.getComments(changes.selectedPost.currentValue);
    }
  }

  resetComment(): void {
    this.comment = new Comment();
  }

  setCommentsFromPageable(data: any): void {
    this.comments = Object.assign([], data.content).map(item => {
      return Object.assign(new Comment, item);
    });
  }

  getComments(post: Post): void {
    if (post && post.id) {
      this.commentService.getCommentsByPostId(post.id)
        .subscribe(data => {
          this.setCommentsFromPageable(data);
        });
    }
  }

  addComment(): void {
    this.commentService.addComment(this.selectedPost.id, this.comment)
      .subscribe(data => {
        this.resetComment();
        this.getComments(this.selectedPost);
      });
  }

}
