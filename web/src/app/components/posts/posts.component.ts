import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {Router} from '@angular/router';
import {PostService, AuthService} from '../../api';
import {Post} from '../../model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  @ViewChild('accordion', {static: true}) Accordion: MatAccordion
  posts: Post[];
  comment: string;
  selectedPost: Post;
  authored: boolean;
  all: boolean;

  constructor(
    private postService: PostService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.authored = this.router.url.includes('authored');
    this.all = this.router.url.includes('all');
    this.selectedPost = null;

    if (!this.authService.isUserLoggedIn()) {
      this.router.navigate(['/register']);
    }

    let authorized: boolean;
    if (this.all) {
      authorized = this.authService.loggedInUserAuthorizedForPath('/posts/all');
    }
    if (
      (this.all && !authorized) ||
      (!this.all && !this.authored)
    ) {
      this.router.navigate(['/posts/authored']);
    }
  }

  setPostsFromPageable(data: any): void {
    this.posts = Object.assign([], data.content).map(item => {
      return Object.assign(new Post, item);
    });
  }

  ngOnInit(): void {
    if (this.authored) {
      this.postService
        .getPostListAuthored()
        .subscribe((data) => {
          this.setPostsFromPageable(data);
        });
    } else if (this.all) {
      this.postService
        .getPostList()
        .subscribe((data) => {
          this.setPostsFromPageable(data);
        });
    }
  }

  editPost(post: Post): void {
    this.router.navigate(['/post/edit/' + post.id])
  }

  viewPost(post: Post): void {
    this.router.navigate((['/post/view/' + post.id]))
  }

  deletePost(post: Post): void {
    this.router.navigate((['/post/delete/' + post.id]))
  }

  selectPost(post: Post): void {
    this.selectedPost = post;
  }
  isPostSelected(): boolean {
    return this.selectedPost !== null;
  }
  beforePanelClosed(post) {
    if (this.selectedPost.id === post.id) {
      this.selectPost(null);
    }
  }
  beforePanelOpened(post) {
    this.selectPost(post);
  }

  afterPanelClosed() { }
  afterPanelOpened() { }

  closeAllPanels() {
    this.Accordion.closeAll();
  }
  openAllPanels() {
    this.Accordion.openAll();
  }
}
