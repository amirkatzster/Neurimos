import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
  <ul class="nav nav-tabs" role="tablist" dir="rtl">
    <li class="nav-item nav-right">
      <a class="nav-link active" data-toggle="tab" href="#shoes" role="tab">נעליים</a>
    </li>
    <li class="nav-item nav-right">
      <a class="nav-link" data-toggle="tab" href="#companies" role="tab">חברות</a>
    </li>
    <li class="nav-item nav-right">
      <a class="nav-link" data-toggle="tab" href="#users" role="tab">משתמשים</a>
    </li>
  </ul>
  <div class="tab-content">
    <div class="tab-pane active" id="shoes" role="tabpanel">
      <app-shoes></app-shoes>
    </div>
    <div class="tab-pane" id="companies" role="tabpanel">
      <app-company></app-company>
    </div>
    <div class="tab-pane" id="users" role="tabpanel">
      <app-users-admin></app-users-admin>
    </div>
  </div>
  `
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
