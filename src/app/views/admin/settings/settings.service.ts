import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { UserInterface } from '../../../interfaces/user.interface';

@Injectable({
  'providedIn': 'root'
})
export class SettingsService {

  constructor(private http: HttpService<UserInterface>, private sessionService: SessionService){ }

  //Calls API with the user ID and returns an Observable
  getUserInformation(): Observable<UserInterface> {
    return this.http.get('get-user/' + this.sessionService.userId);
  }

  //Posts to the API with credentials and returns an Observable ready to be subscribed
  updateSettings(name: string, email: string, notificationSound: string, id: string): Observable<any> {
    return this.http.post('update-user', {'name': name, 'email': email, 'notificationSound': notificationSound, 'id': id});
  }

  //Deletes user account
  deleteAccount(password: string): Observable<any> {
    return this.http.post('delete-account', {'password': password, 'id': this.sessionService.userId});
  }

}
