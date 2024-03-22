import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../common/course';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private httpClient: HttpClient) {}

  getCourses(): Observable<any>{
    return this.httpClient.get<Course[]>(
      environment.backendUrl + '/courses'
    )
  }

  addCourse(course: Course): Observable<any> {
    return this.httpClient.post<Course>(
      environment.backendUrl + '/courses',
      course
    );
  }

  updateCourse(course: Course, courseId: string): Observable<any> {
    return this.httpClient.put<Course>(
      environment.backendUrl + '/courses?courseId=' + courseId,
      course,
    );
  }

  uploadThumbnail(fileEntry: File, courseId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileEntry);
    formData.append('courseId', courseId);

    return this.httpClient.post(
      environment.backendUrl + '/courses/thumbnail',
      formData,
      { responseType: 'text' }
    );
  }
}
