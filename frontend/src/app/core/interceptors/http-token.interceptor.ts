import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable({
  'providedIn': 'root'
})
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService){ }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //If request doesn't contain X-Skip-Interceptor headers, adds the token in the request
    if (req.headers.has('X-Skip-Interceptor') === false) {
      //Checks if token is available, if so adds to the request
      if (this.sessionService.jwt !== undefined) {
        //Clones the request so that we can modify it however we like
        const reqClone = req.clone({
          //Adds a parameters with the Jwt token. This parameters will be added to all http calls that don't have X-Skip-Interceptor header
          params: req.params.set('jsonwebtoken', this.sessionService.jwt)
        });
        return next.handle(reqClone);
      }
    }
    return next.handle(req);
  }

}
