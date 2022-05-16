import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PanelService } from './panel.service';

@Injectable({
  'providedIn': 'root'
})
export class PanelResolver implements Resolve<Array<any>> {

  constructor(private panelService: PanelService){ }

  //Awaits for data to be retrieved before showing Panel Component
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<any>> {
    return this.panelService.getGeneralInformation();
  }

}
