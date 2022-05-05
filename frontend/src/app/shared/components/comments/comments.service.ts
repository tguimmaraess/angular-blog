import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { CommentInterface } from '../../../interfaces/comment.interface';
import { Observable } from 'rxjs';
import { SkipInterceptorHeader } from '../../../core/services/config/service.config';

@Injectable({
  'providedIn':'root'
})
export class CommentsService {

  constructor(private http: HttpService<Array<CommentInterface>>){ }

  //Adds a comment
  addComment(articleId: string, title: string, name: string, email: string, comment: string) {
    return this.http.post('add-comment', {'articleId': articleId, 'title': title, 'name': name, 'email': email, 'comment': comment}, SkipInterceptorHeader);
  }

  //Gets all comments of a certian article passing the article id
  getComments(articleId: string): Observable<Array<CommentInterface>> {
    return this.http.get('get-comments/' + articleId);
  }

}
