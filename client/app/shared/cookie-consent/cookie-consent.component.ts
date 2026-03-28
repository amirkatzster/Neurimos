import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorage } from 'app/shared/local-storage.service';

@Component({
  standalone: false,
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {

  visible = false;

  constructor(
    private localStorage: LocalStorage,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.visible = !this.localStorage.getItem('cookie-consent');
    }
  }

  accept() {
    this.localStorage.setItem('cookie-consent', 'accepted');
    this.visible = false;
  }
}
