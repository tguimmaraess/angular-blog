import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticlesService } from './articles.service';
import { SessionService } from '../../../core/services/session.service';
import { ArticleInterface } from '../../../interfaces/article.interface';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  public articles: Array<ArticleInterface> = []; //Initializes variable with type ArticleInterfacem as array
  public ok: boolean =  false;  //All articles retrieved
  public pageIndex: number = 1; //Page we are in
  public pageEvent: any =  {} as any; //Page change paginator
  public p: number = 1; //Current page paginator
  public itemsPerPage: number = 7; //Items per page paginator
  private subscribe$: Subscription = {} as Subscription; //Property subscribe$ of type Subscription

  constructor(private articlesService: ArticlesService,
              private sessionService: SessionService,
              private snackBar: SnackBarService) { }

  //Gets all articles when the page is ready
  ngOnInit(): void {
    this.getAllArticles();
  }

  //Gets all articles
  getAllArticles(): void {
    //Defines property subscribe$ with observable subscription
    this.subscribe$ = this.articlesService.getAllArticles()
    .subscribe((re: any) => {
      this.ok =  true; //Defines ok as true
      this.articles = re.result; //Defines articles variable with result from database
    });
  }

  //Likes or removes a like from an article
  likeArticle(articleId: string, like: string): void {
    this.articlesService.likeArticle(articleId, like).subscribe((re: any) => {
      if (like == '+') {
        window.localStorage.setItem(articleId, 'liked'); //If operation is + (add like), stores like in local storage
      } else {
        window.localStorage.removeItem(articleId); //If not, then, removes it
      }
    });
  }

  //Checks if article is liked or not
  notLiked(articleId: string): boolean {
    if (window.localStorage.getItem(articleId)) {
      return false; //The article has a like
    } else {
      return true; //The article doesn't have a like
    }
  }

  //On component leave, unsubscribe
  ngOnDestroy(): void {
    this.subscribe$.unsubscribe();
  }

}
