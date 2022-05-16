import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SigninService } from './signin.service';
import { SessionService } from '../../../core/services/session.service';
import { Validator } from '../../../shared/common/helpers/validator';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

  public title = 'Sign In';
  public userSignin: FormGroup = {} as FormGroup;
  public invalidSignin: boolean = false; //Sigin failed or not
  public emailFormControl: FormControl = this.validator.validateEmail(); //Email form control
  public passwordFormControl: FormControl = this.validator.validatePassword() //Password form control
  public matcher: ErrorStateMatcher = this.validator.matcher() //Matcher will check the fields on key press
  public wait: boolean = false; //Waiting for request to be completed

  constructor(
              private validator: Validator,
              private formBuilder: FormBuilder,
              private signinService: SigninService,
              private router: Router,
              private sessionService: SessionService,
              private snackBar: SnackBarService
            ){ }

  ngOnInit(): void {
    //If user is already signed in, redirects to the panel
    if (this.sessionService.signedInStatus) {
      this.router.navigate(['admin/panel']);
    }
    //Form builder
    this.userSignin = this.formBuilder.group({
      email: this.emailFormControl,
      password: this.passwordFormControl
    });
  }

  //Do the signin
  doSignin(value: any): void {
      //If any errors is detected, doesn't send the form
      if (!this.userSignin.valid) {
        return;
      }else{
      this.wait = true; //We are waiting for request to be completed, with either success or error message
      //If everything is OK, calls the sign in service with email and password
      this.signinService.signin(value.email, value.password).pipe(
        catchError((error: any) => {
          return of(error)
        })
      ).subscribe((re: any) => {
        //If user is successfully signed in, redirects to panel and creates a session, else shows error message
        if (re.message == 'ok') {
          this.wait = false; //We aren't waiting anymore
          this.sessionService.setUserSession = re.result; //Defines user session with user information and token
          this.router.navigate(['admin/panel']); //Redirects to panel
          this.snackBar.openSnackBar('Hello ' + this.sessionService.name, 'success'); //Shows a message
        } else {
          this.wait = false; //We aren't waiting anymore
          this.snackBar.openSnackBar(re.error.message, 'danger'); //Shows an error message if anything went wrong
          this.invalidSignin = true; //The sign in wasn't successful
        }
      });
    }
  }

}
