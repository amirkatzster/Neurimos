import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MdButtonModule, MdCheckboxModule, MdRadioModule, MdAutocompleteModule, MdSelectModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    BrowserAnimationsModule,
    MdCheckboxModule,
    MdRadioModule,
    MdAutocompleteModule,
    MdSelectModule,
  ],
  exports: [
    // Shared Modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    BrowserAnimationsModule,
    MdCheckboxModule,
    MdRadioModule,
    MdAutocompleteModule,
    MdSelectModule,
    // Shared Components
    ToastComponent,
    LoadingComponent,
    HeaderComponent
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    HeaderComponent
],
  providers: [
    ToastComponent
  ]
})
export class SharedModule { }
