import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full', },
  { path: '', component: DefaultLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/default-layout/default-layout.module#DefaultLayoutModule'
    }]
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
