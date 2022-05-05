import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';

@Injectable({
  'providedIn': 'root'
})
export class CreateArticleService {

  constructor(private http: HttpService<any>){}

  //Saves article
  createArticle(title: string, post: string, date: string, id: string, name: string, email: string, thumbnail: string): Observable<any> {
      return this.http.post('create-article',
                                {
                                  'title': title,
                                  'post': post,
                                  'date': date,
                                  'id': id,
                                  'name': name,
                                  'email': email,
                                  'thumbnail': thumbnail
                                });
  }

}
