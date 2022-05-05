import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from '../../../shared/common/helpers/validator';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { EditArticleService } from './edit-article.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TextEditorComponent } from '../../../shared/components/text-editor/text-editor.component';
import { ArticleInterface } from '../../../interfaces/article.interface';
import { SessionService } from '../../../core/services/session.service';
import { Utility } from '../../../shared/common/helpers/utility';
import { of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {

  public editArticle: FormGroup = {} as FormGroup; //Form group variable
  public article: ArticleInterface = {} as ArticleInterface; //Article interface
  public fileName: string =  ''; //Name of the thumbnail
  private file: File = {} as File; //File uploaded
  private appendedFile:  string = '' //File converted to base64
  public titleFormControl: any = this.validator.validateTitle(); //Title form control
  public postFormControl: any = this.validator.validateArticle(); //Article (text editor) form control
  public imageFormControl: any = this.validator.validateImage(); //Image form control
  public matcher: any = this.validator.matcher(); //Macther will check as keys are pressed
  public ok: boolean = false; //Article is retrieved
  public wait: boolean = false //Waits for request to be completed
  public textEditorDataEdit: string = ''; //Post content from database that will used to fill the TextEditor Component

  constructor(private formBuider: FormBuilder,
              private validator: Validator,
              private snackBar: SnackBarService,
              private editArticleService: EditArticleService,
              private router: Router,
              private route: ActivatedRoute,
              private sessionService: SessionService,
              private utility: Utility) { }

  ngOnInit(): void {
    //Gets article id parameter from route and gets article by the id from database
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getArticle(params.get('id') as string);
    });

    //editArticle form builder
    this.editArticle = this.formBuider.group({
      title: this.titleFormControl, //Title form control
      post: this.postFormControl, //Empty post (TextEditor content) will be defined on Output event with text editor data
      thumbnail: this.imageFormControl, //Thubmnail form control
    });
  }

  //Gets article by id calling a function in EditArticle Service
  getArticle(id: string): void {
    this.editArticleService.getArticle(id).subscribe((re: any) => {
      this.ok = true; //Defines ok as true
      this.article = re.result; //Defines article interface with result from mongodb
      if(this.sessionService.userId !== this.article.author._id){ //Checks if author can edit the article
        this.router.navigate(['/admin/panel']);
      }
      this.textEditorDataEdit = this.article.post //Defines textEditorDataEdit with the article content (post) from mongodb
      this.editArticle.controls.post.setValue(this.textEditorDataEdit); //Defines post form control with the article content so that post form control won't be empty
    });
  }

  //Gets data from TextEditor Component
  getContent(value: string): void {
    this.textEditorDataEdit = value; //Defines variable textEditorDataEdit with the content of text editor from TextEditor component
    this.editArticle.controls.post.setValue(this.textEditorDataEdit); //Defines post form control with data from text editor
  }

  //When file is selected
  fileSelected(event: any): void {
     this.file = event.target.files[0]; //Gets the file from file input
     this.fileName = this.file.name; //Defines fariable fileName with the name of the file
     const fileReader = new FileReader(); //NewReader instance
     fileReader.readAsDataURL(this.file); //Transforms file into base64
     fileReader.onload = () => {
      //When loading, defines appendedFile with the result of the conversion to base64
      this.appendedFile = fileReader.result as string;
     }
  }

  //Calls service to post form data and content of the text editor to be saved in the backend
  doSaveArticle(value: any): void {
    //If any errors detected, shows error message
    if (!this.editArticle.valid) {
       this.snackBar.openSnackBar('Error creating article. Check all fields', 'danger');
       return;
    }
    this.wait = true; //Waiting to request to complete
    //Saves article if everything is OK
    this.editArticleService.editArticle(
        value.title,
        value.post,
        this.utility.getDateTime(),
        this.article._id,
        this.sessionService.name,
        this.sessionService.email,
        this.appendedFile,
        this.sessionService.userId
      ).pipe(
        catchError((error: any) => {
          return of(error);
        })
      ).subscribe((re: any): void => {
      if (re.message == 'ok') {
        this.wait = false; //Request completed
        this.snackBar.openSnackBar('Article successfully edited', 'success');
        this.router.navigate(['admin/articles']);
      } else {
        this.wait = false; //Request completed
        this.snackBar.openSnackBar('Error edtiting article. Check if any alteration has been made', 'danger');
      }
    });
  }

}
