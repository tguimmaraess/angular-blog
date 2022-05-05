import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  'providedIn': 'root'
})
export class BarChartService {

  constructor(private http: HttpService<any>) { }

  getArticleVisitsPerMonth(id: string) {
    return this.http.get('get-article-visits-per-month/' + id);
  }

}
