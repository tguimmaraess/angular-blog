import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { UserInterface } from '../../../interfaces/user.interface';
import { SkipInterceptorHeader } from '../../../core/services/config/service.config';

@Injectable({
  'providedIn': 'root'
})
export class SigninService {

  private userInterface: UserInterface = {} as UserInterface;

  constructor(private http: HttpService<UserInterface>){ }

  //Calls API with email and password
  signin(email: any, password: any): Observable<UserInterface> {
    return this.http.post('user-signin', {'email': email, 'password': password}, SkipInterceptorHeader);
  }

}
