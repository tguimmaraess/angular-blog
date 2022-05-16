import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentsService } from './comments.service';
import { CommentInterface } from '../../../interfaces/comment.interface';
import { ActivatedRouteSnapshot, RouterStateSnapshot, ParamMap, Resolve } from '@angular/router';

@Injectable({
  'providedIn': 'root'
})
export class CommentsResolver implements Resolve<Array<CommentInterface>> {

  private commentsInterface: CommentInterface = {} as CommentInterface;

  constructor(private commentsService: CommentsService){ }

  //Awaits for data to be retrieved from database, so that the Comments component will only show anything after the data is ready.
  resolve(id: any): Observable <Array<CommentInterface>> {
    //Calls getUserInformation function in SettingsService passing the id of the signedin user
    return this.commentsService.getComments(id);
  }

}
