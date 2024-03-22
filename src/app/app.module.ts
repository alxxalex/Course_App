import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadVideoComponent } from './components/upload-video/upload-video.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { HttpClientModule } from '@angular/common/http';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { LoginComponent } from './components/login/login.component';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

import myAppConfig from './config/my-app-config';
import { CourseVideosComponent } from './components/course-videos/course-videos.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { CoursesComponent } from './components/courses/courses.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from './material.module';
import { CardComponent } from './components/card/card.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { CourseContentComponent } from './components/course-content/course-content.component';

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
    CourseContentComponent
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
    MaterialExampleModule
  ],
  providers: [{ provide: OKTA_CONFIG, useValue: { oktaAuth  } }],
  bootstrap: [AppComponent],
})
export class AppModule {}
