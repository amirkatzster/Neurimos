import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Prerender } from './shared/prerender.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService,
    private prerender: Prerender) {
      this.prerender.starting();
  }

}
