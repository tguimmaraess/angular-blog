import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { SessionService } from '../../../core/services/session.service';
import { Observable } from 'rxjs';
import { NotificationInterface } from '../../../interfaces/notification.interface';

@Injectable({
  'providedIn': 'root'
})
export class NotificationsService {

  constructor(private http: HttpService<Array<NotificationInterface>>, private sessionService: SessionService){ }

  //Gets all notifications of the usser
  getNotifications(): Observable<Array<NotificationInterface>> {
    return this.http.get('get-notifications/' + this.sessionService.userId);
  }

}
