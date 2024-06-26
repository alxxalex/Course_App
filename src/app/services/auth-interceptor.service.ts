import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    const securedEndpoints = [
      'http://localhost:8080/api/enrollment/add',
      'http://localhost:8080/api/courses/rating',
      'http://localhost:8080/api/courses/update',
      'http://localhost:8080/api/courses/add',
      'http://localhost:8080/api/courses/thumbnail',
      'http://localhost:8080/api/courses/auxiliaryFile',
      'http://localhost:8080/api/videos',
      'http://localhost:8080/api/courses/delete/',
      'http://localhost:8080/api/users'
    ];
    if (securedEndpoints.some((url) => request.urlWithParams.includes(url))) {
      const accessToken = this.oktaAuth.getAccessToken();

      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
    }
    return await lastValueFrom(next.handle(request));
  }
}
