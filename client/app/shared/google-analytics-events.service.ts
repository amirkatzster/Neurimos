import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare let gtag: Function;

@Injectable()
export class GoogleAnalyticsEventsService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    if (!isPlatformBrowser(this.platformId) || typeof gtag === 'undefined') { return; }
    const params: Record<string, any> = { event_category: eventCategory };
    if (eventLabel !== null) { params['event_label'] = eventLabel; }
    if (eventValue !== null) { params['value'] = eventValue; }
    gtag('event', eventAction, params);
  }
}
