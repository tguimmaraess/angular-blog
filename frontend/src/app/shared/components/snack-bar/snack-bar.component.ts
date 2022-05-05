import { Component, OnInit, Injectable, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})


export class SnackBarComponent implements OnInit {

constructor(private snackBar: MatSnackBar){ }

openSnackBar(message: string, type: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [type]
    });
  }

  ngOnInit(): void {
  }

}
