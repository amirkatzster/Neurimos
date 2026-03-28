import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: false,
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent {
  constructor(private title: Title) {
    this.title.setTitle('הצהרת נגישות | נעלי נעורים');
  }
}
