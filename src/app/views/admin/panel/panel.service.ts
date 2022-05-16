import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { SessionService } from '../../../core/services/session.service';

@Injectable({
'providedIn': 'root'
})
export class PanelService {

  constructor(private http: HttpService<any>, private sessionService: SessionService){ }

  //Gets general data for the panel
  getGeneralInformation(): Observable<any> {
    return this.http.get('get-general-information/' + this.sessionService.userId);
  }
  
}
