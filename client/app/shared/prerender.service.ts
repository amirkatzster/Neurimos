import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class Prerender {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  starting() {
    if (isPlatformBrowser(this.platformId)) {
      (<any>window).prerenderReady = false;
    }
  }

  done() {
    if (isPlatformBrowser(this.platformId)) {
      (<any>window).prerenderReady = true;
    }
  }
}
