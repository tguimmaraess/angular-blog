import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopNavComponent implements OnInit {

  public signedIn: boolean = false;

  constructor(private sessionService: SessionService){ }

  ngOnInit(): void {
    //If user is already signed in,defines signedIn as true
    if (this.sessionService.signedInStatus) {
      this.signedIn =  true;
    }
  }

}
