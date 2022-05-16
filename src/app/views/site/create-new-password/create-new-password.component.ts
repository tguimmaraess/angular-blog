import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CreateNewPasswordService } from './create-new-password.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { NgForm } from '@angular/forms';
import {of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.css']
})
export class CreateNewPasswordComponent implements OnInit {

  private email: string ='';
  private hash: string = '';
  public wait: boolean = false; //Waits for request to be completed

  constructor(private route: ActivatedRoute,
              private router: Router,
              private createNewPasswordService: CreateNewPasswordService,
              private snackBar: SnackBarService) { }

  ngOnInit(): void {
  }

  //Calls service to create new password
  doCreateNewPassword(value: any): void {
    this.route.paramMap.subscribe((re: ParamMap) => {
      this.wait = true; //We wait for the request to be completed;
      this.createNewPasswordService.createNewPassword(value.password, re.get('email') as string, re.get('hash') as string).pipe(
        catchError((error: any) => {
          return of(error);
        })
      ).subscribe((re: any) => {
      if (re.message == 'ok') {
        this.router.navigate(['/signin']);
        this.snackBar.openSnackBar('Password sucessfully recovered', 'success');
        this.wait = false; //We aren't waiting anymore
      } else {
        this.snackBar.openSnackBar(re.message, 'danger');
        this.wait = false; //We aren't waiting anymore
      }
     });
    });
  }
}
