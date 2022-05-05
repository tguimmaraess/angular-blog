import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/app-shared.module';

//Layouts
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

//Admin Panel Components
import { PanelComponent } from './views/admin/panel/panel.component';
import { NotificationsComponent } from './views/admin/notifications/notifications.component';
import { ArticlesComponent as UserArticlesComponent } from './views/admin/articles/articles.component';
import { CreateArticleComponent } from './views/admin/create-article/create-article.component';
import { SettingsComponent } from './views/admin/settings/settings.component';
import { EditArticleComponent } from './views/admin/edit-article/edit-article.component';

//Site components
import { ArticlesComponent as AllArticlesComponent } from './views/site/articles/articles.component';
import { ArticleComponent } from './views/site/article/article.component';
import { SigninComponent } from './views/site/signin/signin.component';
import { CreateAccountComponent } from './views/site/create-account/create-account.component';
import { ForgotPasswordComponent } from './views/site/forgot-password/forgot-password.component';
import { CreateNewPasswordComponent } from './views/site/create-new-password/create-new-password.component';

//Shared Components
import { HeaderComponent } from './shared/components/header/header.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { TextEditorComponent } from './shared/components/text-editor/text-editor.component';
import { TopNavComponent } from './shared/components/topnav/topnav.component';
import { CommentsComponent } from './shared/components/comments/comments.component';
import { NotificationBellComponent } from './shared/components/notification-bell/notification-bell.component';
import { LineChartComponent } from './shared/components/line-chart/line-chart.component';
import { BarChartComponent } from './shared/components/bar-chart/bar-chart.component';
import { PieChartComponent } from './shared/components/pie-chart/pie-chart.component';
import { ProgressBarComponent } from './shared/components/progress-bar/progress-bar.component';

//Helper Classes
import { ConfirmAccountDeletionDialog } from './views/admin/settings/settings.component';

//Pipes
import { BypassSecurityPipe } from './shared/pipes/bypasssecurity.pipe';
import { TransformDatePipe } from './shared/pipes/transform-date.pipe';
import { TransformTimePipe } from './shared/pipes/transform-time.pipe';
import { LimitTextPipe } from './shared/pipes/limit-text.pipe';

//Directives
import { RouterTransformerDirective } from './shared/directives/router-transformer.directive';

//Http Interceptor imports
import { HTTP_INTERCEPTORS } from '@angular/common/http'; //HTTP_INTERCEPTORS imports
import { HttpTokenInterceptor } from './core/interceptors/http-token.interceptor'; //Our HttpTokenInterceptor class to add token in all http calls

//Services where the HttpInterceptor will be injected into, usually components where authentication is required.
//We could add the parameters manually directly in our services but maintenance is easier if we do in this way
import { PanelService } from './views/admin/panel/panel.service';
import { ArticlesService } from './views/admin/articles/articles.service';
import { EditArticleService } from './views/admin/edit-article/edit-article.service';
import { CreateArticleService } from './views/admin/create-article/create-article.service';
import { SettingsService } from './views/admin/settings/settings.service';

@NgModule({
  declarations: [
    AppComponent,
    SiteLayoutComponent,
    AdminLayoutComponent,
    TopNavComponent,
    AllArticlesComponent,
    ArticleComponent,
    ForgotPasswordComponent,
    CreateNewPasswordComponent,
    SigninComponent,
    CreateAccountComponent,
    PanelComponent,
    NotificationsComponent,
    UserArticlesComponent,
    CreateArticleComponent,
    EditArticleComponent,
    SettingsComponent,
    ConfirmAccountDeletionDialog,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    HeaderComponent,
    ProgressBarComponent,
    TextEditorComponent,
    SidenavComponent,
    ArticleComponent,
    CommentsComponent,
    NotificationBellComponent,
    RouterTransformerDirective,
    BypassSecurityPipe,
    TransformDatePipe,
    TransformTimePipe,
    LimitTextPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
