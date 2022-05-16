import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { ArticleInterface } from '../../../interfaces/article.interface';
import { SkipInterceptorHeader } from '../../../core/services/config/service.config';

@Injectable({
  'providedIn': 'root'
})
export class ArticlesService {

  constructor(private http: HttpService<Array<ArticleInterface>>){ }

  //Gets all articles
  getAllArticles(): Observable<Array<ArticleInterface>> {
    return this.http.get('get-all-articles/', '', SkipInterceptorHeader);
  }

  //Likes an article
  likeArticle(articleId: string, like: string): Observable<any> {
    return this.http.post('like-article/', {'articleId': articleId, 'like': like}, SkipInterceptorHeader);
  }

}
