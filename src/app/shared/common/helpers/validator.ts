import { Injectable } from '@angular/core'

//Reactive Forms Validators
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Injectable({
  'providedIn': 'root'
})
export class Validator { //Class valkidator contains functions to validate the form (FormBuilder, FormGroup)

    //Required
    required() {
      return new FormControl('', [Validators.required]);
    }

    //Validates email (required and built-in function to check if it's a valid email)
    validateEmail() {
      return  new FormControl('', [Validators.required, Validators.email]);
    }

    //Validates password (Required and min length 6 characteres)
    validatePassword() {
      return new FormControl('', [Validators.required, Validators.minLength(6)]);
    }

    //Validates the title of the article (required and a min. of 10 characteres)
    validateTitle() {
      return new FormControl('', [Validators.required, Validators.minLength(10)]);
    }

    //Validates the content of the text editor (Min 100 characteres)
    validateArticle() {
      return new FormControl('', [Validators.required, Validators.minLength(100)]);
    }

    //Only accepts jpg, jpeg and png images
    validateImage() {
      return new FormControl('', [Validators.pattern('.*\.(jpe?g|png)$')]);
    }

    //Validates MongoDB id from form
    validateMongoDbIdFromForm() {
      return new FormControl('', [Validators.required, Validators.minLength(24)]);
    }

    //Validates MongoDB id from url's
    validateMongoDbId(id: string) {
      if(id.length == 24){
        return true;
      }else{
        return false;
      }
    }

    //Validates Comment title
    validateCommentTitle() {
      return new FormControl('', [Validators.required, Validators.minLength(3)]);
    }

    //Validates Comment
    validateComment() {
      return new FormControl('', [Validators.required, Validators.minLength(3)]);
    }

    //Validates Comment
    validateCommentEmail() {
      return new FormControl('', [Validators.email]);
    }

    //Matcher will check the inputs as they are being filled in
    matcher() {
      return new MyErrorStateMatcher();
    }

}
