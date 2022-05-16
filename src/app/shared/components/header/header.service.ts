import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { SessionService } from '../../../core/services/session.service';

@Injectable({
  'providedIn': 'root'
})
export class HeaderService {

  constructor(private httpService: HttpService<any>, private sessionService: SessionService){ }

  //todo


}
