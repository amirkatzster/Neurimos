import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'app/shared/seo.service';

@Component({
  standalone: false,
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent {
  constructor(private title: Title, private seoService: SeoService) {
    this.title.setTitle('הצהרת נגישות | נעלי נעורים');
    this.seoService.setCanonical('/נגישות');
  }
}
