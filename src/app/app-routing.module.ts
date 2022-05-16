import { NgModule } from '@angular/core';
import { RouterModule, CanActivate, Routes } from '@angular/router';

//SigninGuard
import { SigninGuardService as SigninGuard } from './core/services/signin-guard.service';

//Admin Panel Components
import { PanelComponent } from './views/admin/panel/panel.component';
import { ArticlesComponent as UserArticlesComponent } from './views/admin/articles/articles.component';
import { CreateArticleComponent } from './views/admin/create-article/create-article.component';
import { EditArticleComponent } from './views/admin/edit-article/edit-article.component';
import { SettingsComponent } from './views/admin/settings/settings.component';
import { NotificationsComponent } from './views/admin/notifications/notifications.component';

//Site components
import { ArticlesComponent as AllArticlesComponent } from './views/site/articles/articles.component';
import { ArticleComponent } from './views/site/article/article.component';
import { SigninComponent } from './views/site/signin/signin.component';
import { CreateAccountComponent } from './views/site/create-account/create-account.component';
import { ForgotPasswordComponent } from './views/site/forgot-password/forgot-password.component';
import { CreateNewPasswordComponent } from './views/site/create-new-password/create-new-password.component';

//Shared Components
import { CommentsComponent } from './shared/components/comments/comments.component';

//Admin Resolvers
import { SettingsResolver } from './views/admin/settings/settings.resolver';
import { NotificationsResolver } from './views/admin/notifications/notifications.resolver';
import { PanelResolver } from './views/admin/panel/panel.resolver';

//Layouts
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component'; //Admin panel layout
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component'; //Site layout


//Application Routes
const routes: Routes = [
  //Site routes
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: '', //"Index" page will display all articles
        component: AllArticlesComponent //Articles Component from site
      }, {
          path: 'article/:articleId', //Article page (shows an article by its id)
          component: ArticleComponent, //Article Component
      }, {
          path: 'forgot-password', //Forgot password page
          component: ForgotPasswordComponent, //Forgot password Component
      }, {
          path: 'create-new-password/:email/:hash', //Forgot password page
          component: CreateNewPasswordComponent, //Create new password password Component
      }, {
           path: 'signin',
           component: SigninComponent //SignIn Component
      }, {
          path: 'create-account',
          component: CreateAccountComponent //Create Account Component
      },
    ],
  },
  //Admin routes
  {
    path: '',
    component: AdminLayoutComponent, //Main Layout with children wich are the views.
    children:[                      //The children components will be loaded inside AdminLayoutComponent
      {
          path: 'admin/panel',
          component: PanelComponent,   //Panel Component
          resolve: {panelInformation: PanelResolver},
          canActivate: [SigninGuard]
      }, {
          path: 'admin/notifications',
          component: NotificationsComponent,   //Notifications Component
          resolve: {notifications: NotificationsResolver},
          canActivate: [SigninGuard]
      }, {
          path: 'admin/articles',
          component: UserArticlesComponent, //Articles Component from admin
          canActivate: [SigninGuard]
      }, {
          path: 'admin/create-article',
          component: CreateArticleComponent, //Create Articles Component
          canActivate: [SigninGuard]
      }, {
          path: 'admin/edit-article/:id',
          component: EditArticleComponent, //Edit Articles Component
          canActivate: [SigninGuard]
      }, {
          path: 'admin/settings',
          component: SettingsComponent, //Settings Component
          resolve: {userData: SettingsResolver}, //userData variable will have the data that can be retrieved in SettingsComponent
          canActivate: [SigninGuard]
        }
    ],
  },
  //Redirects to signin page if path is incorrect
  { path: '**', component: SigninComponent }, //Sign in Component

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
