import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from '../../../shared/common/helpers/validator';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { CreateArticleService } from './create-article.service';
import { Router } from '@angular/router';
import { TextEditorComponent } from '../../../shared/components/text-editor/text-editor.component';
import { ArticleInterface } from '../../../interfaces/article.interface';
import { SessionService } from '../../../core/services/session.service';
import { Utility } from '../../../shared/common/helpers/utility';
import { of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {

  public createArticle: FormGroup = {} as FormGroup; //Form Group
  public fileName: string =  ''; //Name of the uploaded file
  private file: File = {} as File; //Uploaded file
  private appendedFile:  string = ''; //File converted to base64
  public titleFormControl: any = this.validator.validateTitle(); //Title of the article
  public postFormControl: any = this.validator.validateArticle(); //Article (text editor) form control
  public imageFormControl: any = this.validator.validateImage(); //Thumbnail of the article
  public articleFormControl: any = this.validator.validateArticle(); //Content of the article
  public matcher: any = this.validator.matcher(); //Realinput time verification
  public startedWritting: boolean =  false; //Something was typed in the text editor
  public wait: boolean = false; //We wait for request to finish

  constructor(private formBuider: FormBuilder,
              private validator: Validator,
              private snackBar: SnackBarService,
              private createArticleService: CreateArticleService,
              private router: Router,
              private sessionService: SessionService,
              private utility: Utility) { }

  ngOnInit(): void {
    //Create article form builder
    this.createArticle = this.formBuider.group({
      title: this.titleFormControl, //Article title
      post: this.postFormControl, //Article content (text editor)
      thumbnail: this.imageFormControl //Article thumbnail
    });
  }

  //Defines variable textEditorData with the content of text editor from TextEditor component
  getContent(event: string): void {
    this.createArticle.controls.post.setValue(event); //Defines post (article) with value from @Output of TextEditor Component
    this.startedWritting = true; //Something was typed in the text editor
  }

  //When file is selected
  fileSelected(event: any): void {
     this.file = event.target.files[0]; //File
     this.fileName = this.file.name; //name of the file
     const fileReader = new FileReader(); //NewReader instance
     fileReader.readAsDataURL(this.file); //Transforms file into base64
     fileReader.onload = () => {
       this.appendedFile = fileReader.result as string; //Defines appendedFile with the result of the conversion to base64
     }
  }

  //Calls service to post form data and content of the text editor to be saved in the backend
  doSaveArticle(value: ArticleInterface): void {
    //If any errors detected shows error message
    if (!this.createArticle.valid) {
       this.snackBar.openSnackBar('Error creating article. Check all fields', 'danger');
       this.startedWritting = true;
       return;
    } else {
      this.wait = true; //We wait the api call to complete
      //Saves article passing the input values to the article service
      this.createArticleService.createArticle(
          value.title,
          value.post,
          this.utility.getDateTime(),
          this.sessionService.userId,
          this.sessionService.name,
          this.sessionService.email,
          this.appendedFile
        ).pipe(
          catchError((error: any) => {
            return of(error);
          })
        ).subscribe((re: any): void => {
        //If article was successfully saved shows sucess message and redirects else shows an error
        if (re.message == 'ok') {
           this.wait = false; //Request is completed
           this.snackBar.openSnackBar('Article successfully created', 'success');
           this.router.navigate(['admin/articles']);
        } else {
            this.wait = false; //Request is completed
            this.snackBar.openSnackBar('Error creating article', 'danger');
        }
      });
    }
  }

}
