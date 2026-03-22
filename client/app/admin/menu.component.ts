import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
  <ul class="nav nav-tabs" role="tablist" dir="rtl">
    <li class="nav-item nav-right">
      <a class="nav-link active" data-bs-toggle="tab" data-bs-target="#shoes" role="tab">נעליים</a>
    </li>
    <li class="nav-item nav-right">
      <a class="nav-link" data-bs-toggle="tab" data-bs-target="#companies" role="tab">חברות</a>
    </li>
    <li class="nav-item nav-right">
      <a class="nav-link" data-bs-toggle="tab" data-bs-target="#users" role="tab">משתמשים</a>
    </li>
    <li class="nav-item nav-right">
      <a class="nav-link" data-bs-toggle="tab" data-bs-target="#classifications" role="tab">סוגי נעליים</a>
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
    <div class="tab-pane" id="classifications" role="tabpanel">
      <app-classification></app-classification>
    </div>
  </div>
  `
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
