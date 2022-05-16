import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  'providedIn': 'root'
})
export class TextEditorService {

  constructor(private http: HttpService<any>){}

  //TODO
  //If you to add custom services like image upload

}
