import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NotificationBellService } from './notification-bell.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { SessionService } from '../../../core/services/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {

  public notificationCount: number | null = null; //Number of unseen notifications
  public notificationsElement: string = '';
  public thereIsNewNotifications: boolean = false;
  public badgeHidden: boolean = false; //Badge is hidden or not
  private subscribe$: Subscription =  {} as Subscription; //Observables

  @ViewChild('notificationSound',{static: true}) notificationSound: ElementRef<HTMLAudioElement> = {} as ElementRef<HTMLAudioElement>;

  constructor(private notificationBellService: NotificationBellService,
              private snackBar: SnackBarService,
              private sessionService: SessionService
            ) { }

  ngOnInit(): void {
    this.getNumberOfUnseenNotifications(); //Gets the number of unseen notifications
    this.checkForNewNotifications(); //Checks for new notifications (long polling)
  }

  //Gets number of unseen nnotifications
  getNumberOfUnseenNotifications(): void {
    this.notificationBellService.getNumberOfUnseenNotifications().subscribe((res: any) => {
      this.notificationCount = res.result;
    });
  }

  //Updates the number of unseen notifications
  updateNumberOfUnseenNotifications(): void {
    this.notificationBellService.updateNumberOfUnseenNotifications().subscribe((res: any) => {
      if (res.message == 'ok') {
        this.notificationCount = 0;
       }
    });
  }

  //Checks for new notifications (Long Polling)
  checkForNewNotifications(): void {
    this.subscribe$ = this.notificationBellService.checkForNewNotifications().subscribe((res: any) => {
      this.notificationCount = res.result.length; //Defines notificationCount variable with result from database
      res.result.forEach((item: any) => {
        this.snackBar.openSnackBar(item.title, 'success');
        //If notification sound is allowed, plays sound
        if (this.sessionService.settings.notificationSound === 'yes') {
          this.notificationSound.nativeElement.play();
        }
      });
      //Calls the checkForNewNotifications function again since the request is completed to check for more new notifications
      this.checkForNewNotifications();
    });
  }

  //When component is destroyed, cancels the subscriptions
  ngOnDestroy(): void {
    this.subscribe$.unsubscribe();
  }

}
