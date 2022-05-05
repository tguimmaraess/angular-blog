import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { Observable } from 'rxjs';
import { ArticleInterface } from '../../../interfaces/article.interface';

@Injectable({
  'providedIn': 'root'
})
export class EditArticleService {

  constructor(private http: HttpService<ArticleInterface>){ }

  //Edits article
  editArticle(title: string,
    post: string,
    date: string,
    articleId: string,
    name: string,
    email: string,
    thumbnail: string,
    id: string
  ): Observable<any> {
      return this.http.post('edit-article', {
                                  'title': title,
                                  'post': post,
                                  'date': date,
                                  'articleId': articleId,
                                  'name': name,
                                  'email': email,
                                  'thumbnail': thumbnail,
                                  'id': id
                                });
  }

  //Gets article by article id to edit, let's use the same url we use to get all articles, so we need to check if
  //the article belongs to the signed in user. Let's check it in the EditArticle component, in getArticle function
  getArticle(id: string | null): Observable<ArticleInterface> {
    return this.http.get('get-article/' + id);
  }


}
