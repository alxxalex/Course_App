import { Component, Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { LoginComponent } from './components/login/login.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

import myAppConfig from './config/my-app-config';
import { CourseVideosComponent } from './components/course-videos/course-videos.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { CourseContentComponent } from './components/course-content/course-content.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { CommentPopupComponent } from './components/comment-popup/comment-popup.component';
import { JobInputComponent } from './components/job-input/job-input.component';
import { RecommendedCoursesComponent } from './components/recommended-courses/recommended-courses.component';

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  const router = injector.get(Router);

  router.navigate(['/login']);
}

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login/callback', component: OktaCallbackComponent },
  {
    path: 'upload-video',
    component: UploadVideoComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'course-form',
    component: CourseFormComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'course-videos',
    component: CourseVideosComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'containing/:title',
    component: CoursesComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'recommended-courses',
    component: RecommendedCoursesComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'course-details',
    component: CourseDetailsComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'course-content/:id',
    component: CourseContentComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  },
  {
    path: 'job-input',
    component: JobInputComponent,
    canActivate: [OktaAuthGuard],
    data: { onAuthRequired: sendToLoginPage },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
