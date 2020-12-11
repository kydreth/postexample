import {Routes} from '@angular/router';

import {RegisterComponent} from '../../components/register/register.component';
import {VerificationComponent} from '../../components/verification/verification.component';
import {LoginComponent} from '../../components/login/login.component';
import {PostComponent} from '../../components/post/post.component';
import {PostsComponent} from '../../components/posts/posts.component';
import {DashboardComponent} from '../../components/dashboard/dashboard.component';
import {ProfileComponent} from '../../components/profile/profile.component';
import {UsersComponent} from '../../components/users/users.component';

export const DefaultLayoutRoutes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'verification', component: VerificationComponent},
    {path: 'login', component: LoginComponent},
    {path: 'post',
        children: [
            {path: '', component: PostComponent},
            {path: 'view/:id', component: PostComponent},
            {path: 'edit/:id', component: PostComponent},
            {path: 'delete/:id', component: PostComponent},
        ]
    },
    {path: 'posts',
        children: [
            {path: '', component: PostsComponent},
            {path: 'authored', component: PostsComponent},
            {path: 'all', component: PostsComponent},
        ]
    },
    {path: 'dashboard', component: DashboardComponent},
    {path: 'profile',
        children: [
            {path: '', component: ProfileComponent},
            {path: 'by/id/:id', component: ProfileComponent},
            {path: 'by/email/:email', component: ProfileComponent},
            {path: 'change/email', component: ProfileComponent},
            {path: 'change/password', component: ProfileComponent},
        ]},
    {path: 'users', component: UsersComponent},
];
