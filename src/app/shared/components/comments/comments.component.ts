import { Component, OnInit, Input } from '@angular/core';
import { Validator } from '../../common/helpers/validator';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommentsService } from './comments.service';
import { CommentInterface } from '../../../interfaces/comment.interface';
import { Utility } from '../../common/helpers/utility';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import {of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';

//Interface for new comments that are added
interface NewComment {
  title: string;
  name: string;
  comment: string;
  date: Date;
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  public commentForm: FormGroup = {} as FormGroup;
  public nameFormControl = new FormControl(''); //Name form control
  public emailFormControl = this.validator.validateCommentEmail(); //Email form control
  public titleFormControl = this.validator.validateCommentTitle(); //Title form control
  public commentFormControl = this.validator.validateComment(); //Comment form control
  public comments: Array<CommentInterface> = [] as Array<CommentInterface>; //Comments interface will recieve comments data
  public ok: boolean = false; //Data is ready
  public pageEvent: any =  {} as any; //Change page paginator
  public p: number = 1; //Current page paginator
  public itemsPerPage: number = 10; //Items per page paginator
  public newComment: NewComment = {} as NewComment; //New comment interface

  @Input() authorName: string = ''; //Author Name
  @Input() articleId: string = ''; //Article id

  constructor(private formBuilder:FormBuilder,
              private validator: Validator,
              private commentsService: CommentsService,
              private utility: Utility,
              private snackBar: SnackBarService
              ){ }

  ngOnInit(): void {
    //Comment form
    this.commentForm = this.formBuilder.group({
      name: this.nameFormControl,
      title: this.titleFormControl,
      email: this.emailFormControl,
      comment: this.commentFormControl
    });

    //Gets the comments by article id
    this.getComments(this.articleId);
  }

  //Adds a comment to a certain article
  doAddComment(value: any): void {
    //Checks if there's any error
    if (this.commentForm.valid === false) {
      return;
    } else {
      this.commentsService.addComment(this.articleId, value.title, value.name, value.email, value.comment).pipe(
        catchError((error: any) => {
          return of(error)
        })
      ).subscribe((re: any) => {
      if (re.message == 'ok') {
        this.newComment = value; //newComment Interface with data from comment form
        this.snackBar.openSnackBar('Comment added', 'success');
      } else {
        this.snackBar.openSnackBar(re.error.message, 'danger');
      }
      });
    }
  }

  //Gets all comments of certain article
  getComments(articleId: string): void {
    this.commentsService.getComments(articleId).subscribe((re: any) => {
      this.ok = true;
      if (re.result[0] != null) { //Checks if comments array exists in posts document in mongodb
        this.comments = re.result[0].comments; //Defines Comment Interface with result from database
      } else {
        this.comments = this.comments //Else comments is empty interface
      }
    });
  }

}
