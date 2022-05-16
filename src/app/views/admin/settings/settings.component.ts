import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './settings.service';
import { SessionService } from '../../../core/services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Validator } from '../../../shared/common/helpers/validator';
import { UserInterface } from '../../../interfaces/user.interface';
import { of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public user: UserInterface = {} as UserInterface; //User interface
  public settingsForm: any = ''; //Form
  public message: string =  ''; //Message success or error
  public messageType: string =  ''; //Message type from bootstrap: success, warning, danger, info
  public emailFormControl =  this.validator.validateEmail(); //email validator
  public nameFormControl = this.validator.required(); //Name form control
  public idFormControl = this.validator.validateMongoDbIdFromForm(); //Validates mongodb id
  public notificationSoundFormControl = this.validator.required(); //Notification sound form control
  public wait: boolean = false; //Waiting for request to be completed or not

  constructor(
              private settingsService: SettingsService,
              private formBuilder: FormBuilder,
              private validator: Validator,
              private dialog: MatDialog,
              private sessionService: SessionService,
              private snackBar: SnackBarService,
              private route: ActivatedRoute,
              private router: Router
            ) { }

  ngOnInit(): void {
    //Defines user interface with data from resolve
    this.user = this.route.snapshot.data.userData.result;

    //Settings form
    this.settingsForm = this.formBuilder.group({
       email: this.emailFormControl,
       name: this.nameFormControl,
       id: this.idFormControl,
       notificationSound: this.notificationSoundFormControl
    });
  }

  //Gets radio button Output and defines notificationSoundFormControl with the choosen value
  getNotificationOption(event: any): void {
    this.notificationSoundFormControl.setValue(event.value);
  }

  //Opens dialog to confirm accoutn deletion
  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmAccountDeletionDialog, {
      width: '311px',
    //  data: {name: this.name, animal: this.animal},
    });

    //Closes the dialog
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  //Upates user settings calling the updateSettings function in SettingsService
  updateSettings(value: any): void {
    //If any error is detected doesn't do anything
    if (!this.settingsForm.valid) {
      return;
    }

    this.wait = true; //Waiting for request to be completed
    //Sends form if everything is correct
    this.settingsService.updateSettings(value.name, value.email, value.notificationSound, value.id).pipe(
      catchError((error: any) => {
        return of(error);
      })
    ).subscribe((re: any) => {
      //If message is ok, shows success, else shows error updating settings
      if (re.message == 'ok') {
        this.sessionService.setUserSession = re.result; //Defines user session with result of the updated user document
        this.router.navigate(['/admin/settings/']);
        this.snackBar.openSnackBar(this.message = 'Successfully updated', this.messageType = 'success');
        this.wait = false; //We aren't waiting anymore
      } else {
        this.snackBar.openSnackBar(re.error.message, this.messageType = 'danger');
        this.wait = false; //We aren't waiting anymore
      }
    });
  }
}

//Class that shows and handles the confirm account deletion dialog template when openDialog() is called
@Component({
  selector: 'confirm-account-deletion',
  templateUrl: 'confirm-account-deletion-dialog.html',
})
export class ConfirmAccountDeletionDialog {

  public deletable: boolean = false; //The delete button in confirm account deletion dialog can be clicked or not

  constructor(public dialogRef: MatDialogRef<ConfirmAccountDeletionDialog>,
              private settingsService: SettingsService,
              private sessionService: SessionService,
              private snackBar: SnackBarService) {}

  //Deletes account
  deleteAccount(value: any): void {
    this.settingsService.deleteAccount(value.confirmationPassword).subscribe((re: any) => {
      if (re.message == 'ok') {
        this.snackBar.openSnackBar('Account suscessfully deleted', 'success');
        this.sessionService.signOut(); //Signs out
        this.onNoClick(); //CLoses confirm delete account dialog
      } else {
        this.snackBar.openSnackBar('Error deleting account, check your password', 'danger');
      }
    });
  }

  //Closes delete account dialog
  onNoClick(): void {
    this.dialogRef.close();
  }
}
