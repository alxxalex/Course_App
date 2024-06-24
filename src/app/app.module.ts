import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './components/login/login.component';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

import myAppConfig from './config/my-app-config';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { CourseVideosComponent } from './components/course-videos/course-videos.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { CoursesComponent } from './components/courses/courses.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from './material.module';
import { CardComponent } from './components/card/card.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { CourseContentComponent } from './components/course-content/course-content.component';
// import { VgCoreModule } from '@videogular/ngx-videogular/core';
// import { VgControlsModule } from '@videogular/ngx-videogular/controls';
// import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
// import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommentPopupComponent } from './components/comment-popup/comment-popup.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { JobInputComponent } from './components/job-input/job-input.component';
import { NoDataPageComponent } from './components/no-data-page/no-data-page.component';
import { RecommendedCoursesComponent } from './components/recommended-courses/recommended-courses.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);

@NgModule({
  declarations: [
    AppComponent,
    UploadVideoComponent,
    CourseFormComponent,
    LoginComponent,
    CourseVideosComponent,
    SidebarComponent,
    ChaptersComponent,
    CoursesComponent,
    CardComponent,
    CourseDetailsComponent,
    CourseContentComponent,
    UserProfileComponent,
    StarRatingComponent,
    CommentPopupComponent,
    CommentCardComponent,
    JobInputComponent,
    NoDataPageComponent,
    RecommendedCoursesComponent,
    SearchBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    OktaAuthModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    NgbModule,
    // VgCoreModule,
    // VgControlsModule,
    // VgOverlayPlayModule,
    // VgBufferingModule,
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
