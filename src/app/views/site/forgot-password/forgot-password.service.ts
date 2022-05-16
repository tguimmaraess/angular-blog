import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { SkipInterceptorHeader } from '../../../core/services/config/service.config';

@Injectable({
  'providedIn': 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpService<any>){ }

  //Calls API to send recover password link
  forgotPasswordLink(email: string): Observable<any> {
    return this.http.post('send-forgot-password-link', {'email': email}, SkipInterceptorHeader);
  }

}
