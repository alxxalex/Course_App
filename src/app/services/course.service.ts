import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../common/course';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private httpClient: HttpClient) {}

  getCourses(): Observable<any> {
    return this.httpClient.get<Course[]>(environment.backendUrl + '/courses');
  }

  getCourseById(id: string): Observable<any> {
    return this.httpClient.get<Course>(
      environment.backendUrl + '/courses/' + id
    );
  }

  getCoursesByAuthor(author: string): Observable<any> {
    const params = new HttpParams().set('author', author);

    return this.httpClient.get<Course[]>(
      environment.backendUrl + '/courses/byAuthor',
      { params }
    );
  }

  getEnrolledCourses(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);

    return this.httpClient.get<Course>(
      environment.backendUrl + '/courses/enrolledCourses',
      { params }
    );
  }

  addCourse(course: Course): Observable<any> {
    return this.httpClient.post<Course>(
      environment.backendUrl + '/courses/add',
      course
    );
  }

  updateCourse(course: Course, courseId: string): Observable<any> {
    return this.httpClient.put<Course>(
      environment.backendUrl + '/courses/update?courseId=' + courseId,
      course
    );
  }
  updateCourseRating(course: Course, courseId: string): Observable<any> {
    return this.httpClient.put<Course>(
      environment.backendUrl + '/courses/rating?courseId=' + courseId,
      course
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

  deleteCourse(email: string, id: string): Observable<any> {
    return this.httpClient.delete<void>(
      environment.backendUrl + '/courses/delete/' + id + '?email=' + email
    );
  }

  addAuxiliaryFile(courseId: string, file: File) {
    const formData = new FormData();
    formData.append('auxiliaryFile', file);
    formData.append('courseId', courseId);

    return this.httpClient.post(
      environment.backendUrl + '/courses/auxiliaryFile',
      formData,
      { responseType: 'text' }
    );
  }

  searchCourses(title: string): Observable<any> {
    const params = new HttpParams().set('title', title);

    return this.httpClient.get<Course[]>(
      environment.backendUrl + `/courses/containing`,
      { params }
    );
  }

  findCoursesByTitle(
    title: string,
    thePage: number,
    thePageSize: number,
    jobTitle: string
  ): Observable<any> {
    console.log('pageNumber:' + thePage);
    console.log('pageSize:' + thePageSize);

    const findCoursesByTitleUrl =
      environment.backendUrl +
      `/courses/search?title=${title}&page=${thePage}&size=${thePageSize}&jobTitle=${jobTitle}`;
    return this.httpClient.get<any>(findCoursesByTitleUrl);
  }
}
