import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enrollment } from '../common/enrollment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErnollmentService {

  constructor(private httpClient: HttpClient) { }

  addEnrollment(enrollment:Enrollment):Observable<any>{
    
    return this.httpClient.post<Enrollment>(
      environment.backendUrl + '/enrollment',
      enrollment
    )
  }
}
