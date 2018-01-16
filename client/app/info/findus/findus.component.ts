import { Component, OnInit } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'app-findus',
  templateUrl: './findus.component.html',
  styleUrls: ['./findus.component.scss']
})
export class FindusComponent implements OnInit {

  lat = 32.0215089;
  lng = 34.7759857;
  zoom = 13;

  constructor() { }

  ngOnInit() {
  }

}
