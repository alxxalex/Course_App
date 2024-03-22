import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { LoginComponent } from './components/login/login.component';
import { OktaCallbackComponent } from '@okta/okta-angular';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

import myAppConfig from './config/my-app-config';
import { CourseVideosComponent } from './components/course-videos/course-videos.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { CourseContentComponent } from './components/course-content/course-content.component';

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login/callback', component: OktaCallbackComponent },
  {
    path: 'upload-video',
    component: UploadVideoComponent,
  },
  {
    path: 'course-form',
    component: CourseFormComponent,
  },
  {
    path: 'course-videos',
    component: CourseVideosComponent,
  },
  {
    path:'courses',
    component: CoursesComponent
  },
  {
    path:'course-details',
    component: CourseDetailsComponent
  },
  {
    path:'course-content',
    component: CourseContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
