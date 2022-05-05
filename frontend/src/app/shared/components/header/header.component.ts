import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';
import { HeaderService } from './header.service';
import { NotificationInterface } from '../../../interfaces/notification.interface';
import { Utility } from '../../common/helpers/utility';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private sessionService: SessionService,
              private headerService: HeaderService,
              private utility: Utility){ }

  public userName: string | null = ''; //Name of the user
  public hidden: boolean = false; //sidebar is hide or not

  ngOnInit(): void {
    this.userName = this.sessionService.name;
  }

  signOut(): void {
    this.sessionService.signOut();
  }

  toggleBadgeVisibility(): void {
    if (this.hidden === false) {
      this.hidden = true;
    }
  }

}
