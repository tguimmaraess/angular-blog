import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ArticlesService } from './articles.service';
import { SessionService } from '../../../core/services/session.service';
import { ArticleInterface } from '../../../interfaces/article.interface';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Subscription }  from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  public ok: boolean = false;  //All articles retrieved
  public articles: Array<ArticleInterface> = [] as Array<ArticleInterface>;  //Initializes variable with type ArticleInterfacem as array
  public length: number = 0; //Size of array
  public pageSize: number = 10; //Amount of items per page
  public pageSizeOptions: Array<number> = [5, 10, 20];
  public pageEvent: any = {} as any; //Page change paginator
  public p: number = 1; //Current page paginator
  public itemsPerPage: number = 10; //Items per page paginator
  private subscribe$: Subscription = {} as Subscription; //Property subscribe$ of type Subscription

  @ViewChild('articleIdRef', {read: ElementRef}) articleIdRef: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;

  constructor(private articlesService: ArticlesService,
              private sessionService: SessionService,
              private snackBar: SnackBarService) { }

  //Gets all articles when the page is ready
  ngOnInit(): void {
    this.getArticles();
  }

  //Gets all articles passing the id of the logged user
  getArticles(): void {
    //Defines property subscribe$ with observable subscription
    this.subscribe$ = this.articlesService.getArticles(this.sessionService.userId)
    .subscribe((re: any) => {
      this.ok = true; //Defines ok as true
      this.articles = re.result; //Defines articles variable with result from database
    });
  }

  //Deletes an article
  deleteArticle(articleId: string, event: any): void {
      this.articlesService.deleteArticle(articleId).subscribe((re: any) => {
      //If article was deleted sets visiblity to none and shows a message
      if (re.message == 'ok') {
        this.snackBar.openSnackBar('Article successfully deleted', 'success');
        this.articleIdRef.nativeElement.style.display='none';
      } else {
        this.snackBar.openSnackBar('Error deleting the article', 'danger');
      }
    });
  }

  ngOnDestroy(): void {
    //On component leave, unsubscribe, cancelling then all requests avoiding memory leaks and unecessary requests
    this.subscribe$.unsubscribe();
  }
}
