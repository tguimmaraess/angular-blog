import { Injectable } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  'providedIn': 'root'
})
//Class Utility
export class Utility {

  constructor(private router: Router){ }

  /** Gets international date
   * @returns {string} returns formatted date
   */
  getDate(): string {
    const date: Date = new Date();
    if(date.getMonth() < 10){
      return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
    }else{
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  }

  /** Gets time
   * @returns {string} returns time
   */
  getTime(): string {
    const date: Date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  /** Gets date and time
   * @returns {string} returns international date and time
   */
  getDateTime(): string {
    const date: Date = new Date();
    return `${this.getDate()}:${this.getTime()}`;
  }

}
