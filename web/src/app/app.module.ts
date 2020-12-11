import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';

// imports
import {Configuration} from './configuration';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';
import {AppComponent} from './app.component';

// declarations
import {DefaultLayoutComponent} from './layouts/default-layout/default-layout.component';

// providers
import {GenericService} from './api/generic.service';
import {PostService} from './api/post.service';
import {UserService} from './api/user.service';
import {CommentService} from './api/comment.service';
import {DashboardService} from './api/dashboard.service';
import {authInterceptorProviders} from './api/auth.interceptor';

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
        ComponentsModule,
    ],
    declarations: [
        AppComponent,
        DefaultLayoutComponent,
    ],
    providers: [
        GenericService,
        PostService,
        UserService,
        CommentService,
        DashboardService,
        authInterceptorProviders,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: AppModule,
            providers: [{provide: Configuration, useFactory: configurationFactory}]
        };
    }
}
