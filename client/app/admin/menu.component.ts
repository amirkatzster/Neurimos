import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
  <div class="admin-layout" dir="rtl">
    <div class="admin-topbar">
      <span class="admin-logo"><i class="fa fa-cog"></i> ניהול</span>
      <nav class="admin-tabs">
        <a class="admin-tab" [class.active]="activeTab === 'shoes'" (click)="activeTab = 'shoes'; companyFilter = ''">
          <i class="fa fa-shopping-bag"></i><span>נעליים</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'companies'" (click)="activeTab = 'companies'">
          <i class="fa fa-building"></i><span>חברות</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'classifications'" (click)="activeTab = 'classifications'">
          <i class="fa fa-tags"></i><span>סוגים</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'users'" (click)="activeTab = 'users'">
          <i class="fa fa-users"></i><span>משתמשים</span>
        </a>
      </nav>
    </div>
    <div class="admin-content">
      <app-shoes        *ngIf="activeTab === 'shoes'" [filterCompany]="companyFilter"></app-shoes>
      <app-company      *ngIf="activeTab === 'companies'" (filterByCompany)="companyFilter = $event; activeTab = 'shoes'"></app-company>
      <app-classification *ngIf="activeTab === 'classifications'"></app-classification>
      <app-users-admin  *ngIf="activeTab === 'users'"></app-users-admin>
    </div>
  </div>
  `
})
export class MenuComponent implements OnInit {
  activeTab = 'shoes';
  companyFilter = '';

  constructor() { }

  ngOnInit() { }
}
