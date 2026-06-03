import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

const BASE_URL = 'https://www.neurimshoes.co.il';

export interface PageMeta {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private titleService: Title,
    private metaService: Meta
  ) {}

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

  setMeta({ title, description, keywords, canonical }: PageMeta): void {
    if (title) {
      this.titleService.setTitle(title);
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ name: 'twitter:title', content: title });
    }
    if (description) {
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ name: 'twitter:description', content: description });
    }
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    }
    if (canonical !== undefined) {
      this.setCanonical(canonical);
    }
  }
}
