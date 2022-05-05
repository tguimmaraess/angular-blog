import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { SkipInterceptorHeader } from '../../../core/services/config/service.config';

@Injectable({
  'providedIn': 'root'
})
export class CreateAccountService {

  constructor(private http: HttpService<any>){}

  //Calls API passing sign up form data
  createAccount(name: string, email: string, password: string): Observable<any> {
    return this.http.post('create-account', {'name': name, 'email': email, 'password': password}, SkipInterceptorHeader);
  }

}
