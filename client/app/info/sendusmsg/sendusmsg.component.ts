import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sendusmsg',
  templateUrl: './sendusmsg.component.html',
  styleUrls: ['./sendusmsg.component.scss']
})
export class SendusmsgComponent implements OnInit {

  lat = 32.0215089;
  lng = 34.7759857;
  zoom = 13;

  constructor() { }

  ngOnInit() {
  }

}
