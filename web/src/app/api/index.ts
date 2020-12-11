export * from './auth.service';
import { AuthService } from './auth.service';
export * from './generic.service';
import { GenericService } from './generic.service';
export * from './post.service';
import { PostService } from './post.service';
export * from './user.service';
import { UserService } from './user.service';
export * from './comment.service';
import {CommentService} from './comment.service';
export * from './dashboard.service';
import { DashboardService } from './dashboard.service';

export const Index = [AuthService, GenericService, PostService, UserService, CommentService, DashboardService];
