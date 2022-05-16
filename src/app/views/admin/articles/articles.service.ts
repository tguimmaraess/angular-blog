import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { ArticleInterface } from '../../../interfaces/article.interface';

@Injectable({
  'providedIn': 'root'
})
export class ArticlesService {

  constructor(private http: HttpService<Array<ArticleInterface>>){ }

  //Gets all articles by user id
  getArticles(id: string): Observable<Array<ArticleInterface>> {
    //  return this.http.get('get-articles', {'id': id});
    return this.http.get('get-articles/' + id);
  }

  //Deletes article by article id
  deleteArticle(articleId: string): Observable<any> {
    return this.http.get('delete-article/' + articleId);
  }

}
