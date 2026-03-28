import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: false,
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  constructor(private title: Title) {
    this.title.setTitle('מדיניות פרטיות | נעלי נעורים');
  }
}
