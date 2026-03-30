import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const BASE_URL = 'https://www.neurimshoes.co.il';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  setCanonical(path: string = ''): void {
    const url = `${BASE_URL}${path}`;
    let link: HTMLLinkElement = this.doc.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
