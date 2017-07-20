import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  template: `
    <div>Users</div>
    <app-users-admin></app-users-admin>
    <div>Shoes</div>
    <app-shoes>
  `
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
