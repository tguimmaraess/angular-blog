import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  'providedIn': 'root'
})
export class PieChartService {

  constructor(private http: HttpService<any>) { }

  //Nothing here yet

}
