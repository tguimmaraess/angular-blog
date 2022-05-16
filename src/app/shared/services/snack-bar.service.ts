import { Component, OnInit, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  'providedIn': 'root'
})
export class SnackBarService {

constructor(private snackBar: MatSnackBar){ }

openSnackBar(message: string, type: string, duration?: number): void {
    this.snackBar.open(message, 'Close', {
      duration: duration || 3000,
      panelClass: [type]
    });
  }

}
