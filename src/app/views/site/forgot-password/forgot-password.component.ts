import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ForgotPasswordService } from './forgot-password.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public wait: boolean = false //Request completed or not

  constructor(private forgotPasswordService: ForgotPasswordService, private snackBar: SnackBarService) { }

  ngOnInit(): void {
  }

  sendLinkForgotPassword(value: any): void {
    this.wait = true; //We are waiting for the request tpo be compelted
    this.forgotPasswordService.forgotPasswordLink(value.email).pipe(
      catchError((error: any) => {
        return of(error);
      })
    ).subscribe((re: any) => {
      if (re.message == 'ok') {
        this.wait = false; //The request is completed
        this.snackBar.openSnackBar('If the email is correct you will receive a message with a link to recover your password', 'success', 6000);
      } else {
        this.wait = false; //The request is completed
        this.snackBar.openSnackBar('Error sending link', 'danger');
      }
    });
  }

}
