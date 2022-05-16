import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  public loading: boolean = false; //Loading a page (yes or no?)

  constructor(private router: Router) { }

  ngOnInit(): void {
    //Check navigation state for every component that uses resolve started
    this.router.events.subscribe((eve: Event) => {
      //If navigation has started, displays a progress bar
      if (eve instanceof NavigationStart) {
        this.loading = true; //Defines loading as true, meaning a progress bar will be displayed
      }

      //If an error ocurred or the navigation is canceled or the navifgation has ended, defines loading as false
      if (eve instanceof NavigationEnd || eve instanceof NavigationError || eve instanceof NavigationCancel) {
        this.loading = false;
      }
    })
  }

}
