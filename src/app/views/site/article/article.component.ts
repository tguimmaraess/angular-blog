import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, ParamMap, Router } from '@angular/router';
import { ArticleService } from './article.service';
import { ArticleInterface as Article } from '../../../interfaces/article.interface';
import { SessionService } from '../../../core/services/session.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Validator } from '../../../shared/common/helpers/validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
@Injectable({
  'providedIn': 'root'
})
export class ArticleComponent implements OnInit {

  public article: Article = {} as Article;
  public ok: boolean = false; //Article is ready or not
  public signedIn: boolean = false;
  public resolveData: any = '';
  public id: string = ''; //Id of the signed in user
  private $observable1: Subscription = {} as Subscription;
  private $observable2: Subscription = {} as Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sessionService: SessionService,
              private articleService: ArticleService,
              private snackBar: SnackBarService,
              private validator: Validator){ }

  ngOnInit(): void {

    //If result from resolve is null or undefined, let's redirect to the home page
    if (this.article == null) {
      this.router.navigate(['/']);
    }

    //Defines signed in with the signedInStatus. If signed in it will be true else, false.
    this.signedIn = this.sessionService.signedInStatus;

    //Defines id with the id of the signed in user
    this.id = this.sessionService.userId;

    //Gets the id of the article
    this.route.paramMap.subscribe((re: ParamMap) => {

      const articleId = re.get('articleId') as string;

      //If mongo db isn't valid, redirects to home page
      if (!this.validator.validateMongoDbId(articleId)) {
        this.router.navigate(['/']);
      }

      //Adds article view (visit) passing the id of the article
      this.$observable1 = this.articleService.addView(articleId).subscribe();

      //Gets article
      this.$observable2 = this.articleService.getArticle(articleId).subscribe((re: any) => {
        if (re.message == 'ok') {
          this.ok = true;
          this.article = re.result;
        } else {
           this.snackBar.openSnackBar('Error getting the article. Try again', 'danger');
        }
      });
    });
  }

  //Likes or removes a like from an article
  likeArticle(articleId: string, like: string): void {
    this.articleService.likeArticle(articleId, like).subscribe((res: any) => {
      if(like == '+'){
        window.localStorage.setItem(articleId, 'liked');
        this.snackBar.openSnackBar('You liked this article', 'success');
      }else{
        window.localStorage.removeItem(articleId);
        this.snackBar.openSnackBar('You removed the like', 'success');
      }
    });
  }

  //Checks if article is liked or not
  notLiked(articleId: string): boolean {
    if(window.localStorage.getItem(articleId)){
      return false; //The article has a like
    }else{
      return true; //The article doesn't have a like
    }
  }

  ngOnDestroy(): void {
    this.$observable2.unsubscribe();
    this.$observable1.unsubscribe();
  }

}
