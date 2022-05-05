/**
 * @param   {string} resource     - Resource/endpoint (URL to be accessed) for post, put get and delete request.
 * @param   {Object} parameters   - Parameters for post, put and delete request
 * @param   {Object} [parameters] - Parameters for get request.
 * @param   {Object} [headers]    - Headers
 * @returns {Observable<T>}       - Observable containing the http response as well as the methods from Observable class
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; //Http classes provided by Angular
import { Observable, throwError, timer } from 'rxjs'; //Observable and throwError methods from rxjs
import { catchError, concatMapTo, retryWhen, delay, take, map, mergeMap, tap, finalize } from 'rxjs/operators'; //Handy functions that rxjs provides
import { environment } from '../../../environments/environment';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { SessionService } from './session.service';

/*
HttpService class will provide a way to comunicate to the backend services
A generic class that is type agnostic, meaning that it accepts a type that will be provided by the classes
that inject HttpService. This class will be injected in any classes that need to make HTTP requests,
by doing that, we keep as DRY as possible (Don't Repeat Yourself).
*/

@Injectable({
  'providedIn': 'root'
})
export class HttpService<T> {

  constructor(private httpClient: HttpClient, private snackBar: SnackBarService, private sessionService: SessionService){ }

  private readonly _baseUrl = environment.url;
  private readonly _retryAttempts = 3; //Number of attempts for a given resource if a HTTP request fails
  private readonly _delayInSeconds = 3000 //Delay in seconds before trying again if a HTTP request fails

  //Posts to  API with parameters and returns an Observable
  public post(resource: string, parameters: any, headers?: Object): Observable<T> {
    return this.httpClient.post<T>(this._baseUrl + resource, parameters, headers)
    .pipe(
      retryWhen(this.intrernetOrServerFailed()), //Retries when this happened
      catchError(this.handleError.bind(this)) //When the error is thrown, let's cacth it
    );
  }

  //Update an entity using Puts methods and returns an Observable
  public updade(resource: string, parameters: any, headers?: Object): Observable<T> {
    return this.httpClient.put<T>(this._baseUrl +  resource, parameters, headers)
    .pipe(
      retryWhen(this.intrernetOrServerFailed()), //Retries when this happened
      catchError(this.handleError.bind(this)) //When the error is thrown, let's cacth it
    );
  }

  //Calls API with get request and returns an Observable
  public get(resource: string, parameters?: any, headers?: any): Observable<T> {
    return this.httpClient.get<T>(this._baseUrl + resource, { params: parameters , headers: headers})
    .pipe(
      retryWhen(this.intrernetOrServerFailed()), //Retries when this happened
      catchError(this.handleError.bind(this)) //When the error is thrown, let's cacth it
    );
  }

  //Calls API with get request and returns an Observable. This method returns an array
  //and should be used to retrieve a list
  public getMany(resource: string, parameters?: any): Observable<T[]> {
    return this.httpClient.get<T[]>(this._baseUrl + resource, {params: parameters})
    .pipe(
      retryWhen(this.intrernetOrServerFailed()), //Retries when this happened
      catchError(this.handleError.bind(this)) //When the error is thrown, let's cacth it
    );
  }

  //Delete request to the API and returns an Observable
  public delete(resource: string, parameters?: any)  {
    return this.httpClient.delete<T>(this._baseUrl + resource, parameters)
    .pipe(
      retryWhen(this.intrernetOrServerFailed()), //Retries when this happened
      catchError(this.handleError.bind(this)) //When the error is thrown, let's cacth it
    );
  }

  //Retries when this condition is met, if we don't do this, it will retry the request for every error
  private intrernetOrServerFailed(): any {
    const allowedStatusText = ['Unknown Error']; //Const with statusTexts we will retry (could also be status code)
    return ((attempts: Observable<any>) => { //Retunrs function with Observable type any
      return attempts.pipe( //Returns this pipe
        mergeMap((error: any, i: any) => { //mergeMap to loop each value and merge it to an Observable
          if(allowedStatusText.find((e: any) => {return e == error.statusText})) { //Let's check if the status text is the one returned by the request, if so, we will retry
            const retries = i + 1; //Increments the retries attempts
            if(retries == 1) {  //If retries is in its first attempt, shows message
              this.snackBar.openSnackBar('Trying to connect, please wait.', 'basic', this._delayInSeconds * this._retryAttempts);
            }
            if(retries > this._retryAttempts) { //If retries is more than the defined max number of retry attempts, throws an error
              return throwError(error); //Throws error
            } else {
              return timer(1 * this._delayInSeconds); //Returns the timer and keeps trying
            }
          } else {
            return throwError(error); //Throws error if condition wasn't met without retrying
          }
        }),
      );
    });
  }

  //Shows the error. The error handling is totally contained within this class
  private handleError(error: HttpErrorResponse) {
    //If error is Forbidden, then, destroys the session
    if (error.statusText == 'Forbidden') {
      this.sessionService.signOut();
    }
    this.snackBar.openSnackBar(error.error.message || error.statusText || 'We have an internal problem. We apologise.', 'danger', 9000);
    return throwError(error);
  }
}
