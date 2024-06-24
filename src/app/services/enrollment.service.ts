import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enrollment } from '../common/enrollment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor(private httpClient: HttpClient) {}

  getEnrollemntByEmail(email: string): Observable<any>{
    const params = new HttpParams().set('email', email);

    return this.httpClient.get<Enrollment>(
      environment.backendUrl + '/enrollment',
      {params}
    );
  }

  addEnrollment(email:string,courseId: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('courseId', courseId);

    return this.httpClient.post<Enrollment>(
      environment.backendUrl + '/enrollment/add',
      formData
    );
  }
}
