import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from '../../../shared/common/helpers/validator';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { CreateAccountService } from './create-account.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import {of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  public createAccount: FormGroup = {} as FormGroup;  //Form group variable
  public nameFormControl: FormControl = this.validator.required(); //Name form control
  public emailFormControl: FormControl = this.validator.validateEmail(); //Email form control
  public passwordFormControl: FormControl = this.validator.validatePassword(); //Password form control
  public matcher: ErrorStateMatcher = this.validator.matcher();
  public wait: boolean = false; //Waiting for request to finish

  constructor(private formBuider: FormBuilder,
              private validator: Validator,
              private snackBar: SnackBarService,
              private createAccountService: CreateAccountService,
              private router: Router){ }

  ngOnInit(): void {
    //Create account form
    this.createAccount =  this.formBuider.group({
      name: this.nameFormControl,
      email: this.emailFormControl,
      password: this.passwordFormControl
    });
  }

  //Calls service to post form data to be saved
  doSave(value: any): void {
    //If any errors detected shows error message
    if (!this.createAccount.valid) {
       this.snackBar.openSnackBar('Error creating account. Check all fields', 'danger');
    } else {
      this.wait = true; //We are waiting for the request to be completed
      //Calls function to post form data and add the user
      this.createAccountService.createAccount(value.name, value.email, value.password).pipe(
        catchError((error: any) => {
          return of(error)
        })
      ).subscribe((re: any) => {
        //If account was successfully created, redirects to sign in page
        if (re.message == 'ok') {
          setTimeout(() => {
            this.router.navigate(['signin']);
          }, 3000);
          this.snackBar.openSnackBar('Account successfully created redirecting...', 'success');
        } else {
          this.wait = false; //We aren't waiting anymore
          this.snackBar.openSnackBar(re.error.message, 'danger'); //Shows error if any error happened
        }
      });
    }
  }

}
