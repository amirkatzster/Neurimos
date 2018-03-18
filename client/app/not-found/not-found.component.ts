import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

  constructor(private meta: Meta) {
    this.meta.addTag({ name: 'prerender-status-code', content: '404' });
  }

}
