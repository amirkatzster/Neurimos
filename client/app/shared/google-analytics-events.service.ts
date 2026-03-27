import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare let ga: Function;

@Injectable()
export class GoogleAnalyticsEventsService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    if (!isPlatformBrowser(this.platformId)) { return; }
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
