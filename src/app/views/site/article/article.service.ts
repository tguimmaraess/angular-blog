import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { ArticleInterface } from '../../../interfaces/article.interface';
import { SkipInterceptorHeader } from '../../../core/services/config/service.config';

@Injectable({
  'providedIn': 'root'
})
export class ArticleService {

  constructor(private http: HttpService<ArticleInterface>){}

  //Gets article by article id
  getArticle(articleId: string): Observable<ArticleInterface> {
    return this.http.get('get-article/' + articleId, null, SkipInterceptorHeader);
  }

  //Likes an article passing the id of the article and the operation (+  or - add or remove a like)
  likeArticle(articleId: string, like: string): Observable<any> {
    return this.http.post('like-article/', {'articleId': articleId, 'like': like}, SkipInterceptorHeader);
  }

  //Adds a view to the article (visits)
  addView(articleId: string) {
    return this.http.get('add-article-view/' + articleId, null, SkipInterceptorHeader);
  }

}
