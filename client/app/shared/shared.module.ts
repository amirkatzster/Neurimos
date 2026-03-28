import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { AuthService } from 'app/services/auth.service';
import { RoutingModule } from 'app/routing.module';
import { LocalStorage } from './local-storage.service';
import { Prerender } from './prerender.service';
import { GoogleAnalyticsEventsService } from './google-analytics-events.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatMenuModule,
    MatGridListModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatButtonModule,
    RoutingModule
  ],
  exports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatGridListModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatButtonModule,
    ToastComponent,
    LoadingComponent,
    HeaderComponent,
    FooterComponent,
    CookieConsentComponent
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    HeaderComponent,
    FooterComponent,
    CookieConsentComponent
  ],
  providers: [
    AuthService,
    ToastComponent,
    LocalStorage,
    Prerender,
    GoogleAnalyticsEventsService
  ]
})
export class SharedModule { }
