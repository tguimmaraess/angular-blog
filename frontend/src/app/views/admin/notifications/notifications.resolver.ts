import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { NotificationInterface } from '../../../interfaces/notification.interface';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

@Injectable({
'providedIn': 'root'
})
export class NotificationsResolver implements Resolve<Array<NotificationInterface>> {

constructor(private notificationsService: NotificationsService){ }

  //Awaits for data to be retrieved before loading the Notificaiotions Component
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<NotificationInterface>> | Promise <Array<NotificationInterface>> {
    return this.notificationsService.getNotifications();
  }

}
