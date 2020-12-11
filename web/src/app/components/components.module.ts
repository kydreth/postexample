import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';
import {MaterialModule} from '../material.module';
import {AppRoutingModule} from '../app.routing';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {RegisterComponent} from './register/register.component';
import {VerificationComponent} from './verification/verification.component';
import {LoginComponent} from './login/login.component';
import {PostComponent} from './post/post.component';
import {PostsComponent} from './posts/posts.component';
import {CommentsComponent} from './comments/comments.component';
import {UserComponent} from './user/user.component';
import {UsersComponent} from './users/users.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfileComponent} from './profile/profile.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatExpansionModule,
    MaterialModule,
    AppRoutingModule,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    RegisterComponent,
    VerificationComponent,
    LoginComponent,
    PostComponent,
    PostsComponent,
    CommentsComponent,
    UserComponent,
    UsersComponent,
    DashboardComponent,
    ProfileComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    RegisterComponent,
    VerificationComponent,
    LoginComponent,
    PostComponent,
    PostsComponent,
    CommentsComponent,
    UserComponent,
    UsersComponent,
    DashboardComponent,
    ProfileComponent,
  ]
})
export class ComponentsModule {}
