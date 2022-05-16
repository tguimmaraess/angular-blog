import { Component, OnInit } from '@angular/core';
import { NotificationInterface } from '../../../interfaces/notification.interface';
import { NotificationsService } from './notifications.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public notifications: Array<NotificationInterface> = [] as Array<NotificationInterface>
  public pageEvent: any =  {} as any; //Page change paginator
  public p: number = 1; //Current page paginator
  public itemsPerPage: number = 10; //Items per page paginator
  public loading: boolean = false;

  constructor(
    private notificationsService: NotificationsService, private router: ActivatedRoute){ }

  ngOnInit(): void {
    //Defines notifications interface with data from Notifications Resolver
    this.notifications = this.router.snapshot.data.notifications.result;
  }

  //Gets data from paginator component
  getData(event: any): void {
    this.notifications = event;
  }

}
