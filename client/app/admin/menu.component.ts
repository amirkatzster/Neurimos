import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
  <div class="admin-layout" dir="rtl">
    <div class="admin-topbar">
      <span class="admin-logo"><i class="fa fa-cog"></i> ניהול</span>
      <nav class="admin-tabs">
        <a class="admin-tab" [class.active]="activeTab === 'shoes'" [routerLink]="['/admin/shoes']">
          <i class="fa fa-shopping-bag"></i><span>נעליים</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'companies'" [routerLink]="['/admin/companies']">
          <i class="fa fa-building"></i><span>חברות</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'classifications'" [routerLink]="['/admin/classifications']">
          <i class="fa fa-tags"></i><span>סוגים</span>
        </a>
        <a class="admin-tab" [class.active]="activeTab === 'users'" [routerLink]="['/admin/users']">
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
export class MenuComponent implements OnInit, OnDestroy {
  activeTab = 'shoes';
  companyFilter = '';
  private sub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(params => {
      this.activeTab = params.get('section') || 'shoes';
      if (this.activeTab !== 'shoes') { this.companyFilter = ''; }
    });
  }

  goToShoes(company: string) {
    this.companyFilter = company;
    this.router.navigate(['/admin/shoes']);
  }

  ngOnDestroy() {
    if (this.sub) { this.sub.unsubscribe(); }
  }
}
