import { Component, OnInit, Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
@Injectable()
export class AdminLayoutComponent implements OnInit {

  constructor(){ }

  ngOnInit() {

  }

}
