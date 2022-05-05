import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { SessionService } from '../../../core/services/session.service';
import { Observable } from 'rxjs';
import { NotificationInterface as Notification } from '../../../interfaces/notification.interface';

@Injectable({
  'providedIn': 'root'
})
export class NotificationBellService {

  constructor(private http: HttpService<any>, private sessionService: SessionService){ }

  getNotifications(): Observable<Array<Notification>> {
    return this.http.get('get-notifications/' + this.sessionService.userId);
  }

  getNumberOfUnseenNotifications(): Observable<any> {
    return this.http.get('get-number-of-unseen-notifications/' + this.sessionService.userId);
  }

  checkForNewNotifications(): Observable<Array<Notification>> {
    return this.http.get('check-for-new-notifications/' + this.sessionService.userId);
  }

  updateNumberOfUnseenNotifications(): Observable<any> {
    return this.http.get('update-number-of-unseen-notifications/' + this.sessionService.userId);
  }

}
