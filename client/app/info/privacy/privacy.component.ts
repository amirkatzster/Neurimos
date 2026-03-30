import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'app/shared/seo.service';

@Component({
  standalone: false,
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  constructor(private title: Title, private seoService: SeoService) {
    this.title.setTitle('מדיניות פרטיות | נעלי נעורים');
    this.seoService.setCanonical('/פרטיות');
  }
}
