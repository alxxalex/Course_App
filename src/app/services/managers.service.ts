import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ManagersService {

  constructor(private httpClient: HttpClient) {}

  getManagers(): Observable<any> {
    return this.httpClient.get(environment.backendUrl +'/okta/users'); 
  }
}
