import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInterface } from '../../interfaces/user.interface';

@Injectable({
  'providedIn': 'root'
})
export class SessionService {

  //Private variable controls if the user is signed in or not
  private signedIn: boolean = false;

  //User Interface
  private user: UserInterface = {} as UserInterface;

  constructor(private router: Router){}

  //Gets signed in user id
  get userId(): string {
    return JSON.parse(sessionStorage.getItem('user') || '[]')['_id'];
  }

  //Gets signed in user email
  get email(): string {
    return JSON.parse(sessionStorage.getItem('user') || '[]')['email'];
  }

  //Gets signed in user name
  get name(): string {
    return JSON.parse(sessionStorage.getItem('user') || '[]')['name'];
  }

  //Gets jwt
  get jwt(): string {
    return JSON.parse(sessionStorage.getItem('user') || '[]')['jsonwebtoken'];
  }

  //Gets signed in user settings
  get settings(): any {
    return JSON.parse(sessionStorage.getItem('user') || '[]')['settings'];
  }

  //Gets user signed user status
  get signedInStatus(): boolean {
    if(sessionStorage.getItem('user') !== null) {
      return this.signedIn = true;
    } else {
      return this.signedIn = false;
    }
  }

  //Sets user sesion
  set setUserSession(user: UserInterface) {
    this.user = user;
    this.signedIn = true;
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  //Destroys user session
  signOut(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
