import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUser(email: string): Observable<any> {
    return this.httpClient.get(environment.backendUrl + '/users/' + email);
  }

  addUser(user: User): Observable<any> {
    return this.httpClient.post(environment.backendUrl + '/users', user);
  }

  updateUser(email: string, file: File) {    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);

    return this.httpClient.put(environment.backendUrl + '/users', formData);
  }
}
