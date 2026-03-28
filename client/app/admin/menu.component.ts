import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
  <div class="admin-layout" dir="rtl">
    <div class="admin-topbar">
      <span class="admin-logo"><i class="fa fa-cog"></i> ניהול</span>
      <nav class="admin-tabs">
        <a class="admin-tab" [class.active]="activeTab === 'shoes'" (click)="setTab('shoes')">
          <i class="fa fa-shopping-bag"></i><span>נעליים</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'companies'" (click)="setTab('companies')">
          <i class="fa fa-building"></i><span>חברות</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'classifications'" (click)="setTab('classifications')">
          <i class="fa fa-tags"></i><span>סוגים</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'users'" (click)="setTab('users')">
          <i class="fa fa-users"></i><span>משתמשים</span>
        </a>
      </nav>
    </div>
    <div class="admin-content">
      <app-shoes        *ngIf="activeTab === 'shoes'" [filterCompany]="companyFilter"></app-shoes>
      <app-company      *ngIf="activeTab === 'companies'" (filterByCompany)="goToShoes($event)"></app-company>
      <app-classification *ngIf="activeTab === 'classifications'"></app-classification>
      <app-users-admin  *ngIf="activeTab === 'users'"></app-users-admin>
    </div>
  </div>
  `
})
export class MenuComponent implements OnInit {
  activeTab = 'shoes';
  companyFilter = '';

  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { return; }
    const path = this.location.path();
    const match = path.match(/\/admin\/(\w+)/);
    if (match) { this.activeTab = match[1]; }
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab !== 'shoes') { this.companyFilter = ''; }
    this.location.replaceState('/admin/' + tab);
  }

  goToShoes(company: string) {
    this.companyFilter = company;
    this.setTab('shoes');
  }
}
