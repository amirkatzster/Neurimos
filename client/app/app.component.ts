import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Prerender } from './shared/prerender.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService,
    private prerender: Prerender,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
      this.prerender.starting();
  }

}
