import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';

@Injectable({
  'providedIn': 'root'
})
export class SigninGuardService implements CanActivate {

  constructor(private sessionService: SessionService, private router: Router){ }

  //Method canActivate from CanActivate Interface protects all routes where this method is present
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    //If user is signed in, returns true
    if (this.sessionService.signedInStatus) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}
