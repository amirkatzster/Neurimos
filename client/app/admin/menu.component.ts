import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
  <div class="admin-layout" dir="rtl">
    <div class="admin-topbar">
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
export class MenuComponent implements OnInit, OnDestroy {
  activeTab = 'shoes';
  companyFilter = '';
  private sub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) { return; }
    this.sub = this.route.paramMap.subscribe(params => {
      this.activeTab = params.get('section') || 'shoes';
      if (this.activeTab !== 'shoes') { this.companyFilter = ''; }
    });
  }

  setTab(tab: string) {
    this.router.navigate(['/admin', tab], { replaceUrl: true });
  }

  goToShoes(company: string) {
    this.companyFilter = company;
    this.router.navigate(['/admin', 'shoes'], { replaceUrl: true });
  }

  ngOnDestroy() {
    if (this.sub) { this.sub.unsubscribe(); }
  }
}
