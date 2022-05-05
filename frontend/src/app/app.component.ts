import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public platform: string = ''; //Platform id (browser or server)
  public browser: boolean = true; //Is browser or not

  constructor(@Inject(PLATFORM_ID) platformId: string) {
    this.platform = platformId; //Gets the platform id (browser or server)
  }

  ngOnInit(): void {
    //Defines browser platform with true for browser or false for server
    this.browser = isPlatformBrowser(this.platform);

  }

}
