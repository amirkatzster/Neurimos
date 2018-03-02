import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatRadioModule, MatAutocompleteModule,
         MatSelectModule, MatMenuModule, MatGridListModule, MatChipsModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { AuthService } from 'app/services/auth.service';
import { RoutingModule } from 'app/routing.module';
import { FooterComponent } from './footer/footer.component';
import { FacebookModule } from 'ngx-facebook';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

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
    FacebookModule.forRoot(),
    LazyLoadImagesModule
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
    FacebookModule,
    LazyLoadImagesModule
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    HeaderComponent,
    FooterComponent
],
  providers: [
    AuthService,
    ToastComponent
  ]
})
export class SharedModule { }
