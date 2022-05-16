import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { SkipInterceptorHeader } from '../../../core/services/config/service.config';

@Injectable({
  'providedIn': 'root'
})
export class CreateNewPasswordService {

  constructor(private http: HttpService<any>){ }

  //Calls API to send recover password link
  checkForgotPasswordLink(email: string, hash: string): Observable<any> {
    return this.http.post('check-forgot-password-link', {'email': email, 'hash': hash}, SkipInterceptorHeader);
  }

  //Calls API to create new password
  createNewPassword(password: string, email: string, hash: string): Observable<any> {
    return this.http.post('create-new-password', {'password': password, 'email': email, 'hash': hash}, SkipInterceptorHeader);
  }


}
