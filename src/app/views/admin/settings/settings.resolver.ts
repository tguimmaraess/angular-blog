import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from './settings.service';
import { UserInterface } from '../../../interfaces/user.interface';
import { ActivatedRouteSnapshot, RouterStateSnapshot, ParamMap, Resolve } from '@angular/router';

@Injectable({
  'providedIn': 'root'
})
export class SettingsResolver implements Resolve<UserInterface> {

  private userInterface: UserInterface = {} as UserInterface;

  constructor(private settingsService: SettingsService){ }

  //Awaits for data to be retrieved from database, so that the Settings component will only show anything after the data is ready.
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <UserInterface> {
    //Calls getUserInformation function in SettingsService passing the id of the signedin user
    return this.settingsService.getUserInformation();
  }

}
