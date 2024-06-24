import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor(private httpClient: HttpClient) {}

  getRecommendedCourses(email: string){
    return this.httpClient.post<any>(
      environment.backendUrl + '/predictions/recommend',
      {"email": email}
    );
  }
}
