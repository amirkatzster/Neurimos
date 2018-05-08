import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatRadioModule, MatAutocompleteModule,
         MatSelectModule, MatMenuModule, MatGridListModule, MatChipsModule, MatExpansionModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { AuthService } from 'app/services/auth.service';
import { RoutingModule } from 'app/routing.module';
import { FooterComponent } from './footer/footer.component';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { LocalStorage } from './local-storage.service';
import { Prerender } from './prerender.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import { UICarouselModule } from 'ui-carousel';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSelectModule,
    // MatButtonModule,
    MatMenuModule,
    RoutingModule,
    MatGridListModule,
    MatChipsModule,
    LazyLoadImagesModule,
    MatExpansionModule,
    MatTooltipModule,
    UICarouselModule
  ],
  exports: [
    // Shared Modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatGridListModule,
    MatChipsModule,
    // Shared Components
    ToastComponent,
    LoadingComponent,
    HeaderComponent,
    FooterComponent,
    LazyLoadImagesModule,
    MatExpansionModule,
    MatTooltipModule,
    UICarouselModule
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    HeaderComponent,
    FooterComponent
],
  providers: [
    AuthService,
    ToastComponent,
    LocalStorage,
    Prerender
  ]
})
export class SharedModule { }
