import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatSelectModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { AuthService } from 'app/services/auth.service';
import { RoutingModule } from 'app/routing.module';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FooterComponent } from './footer/footer.component';

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
    RoutingModule
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
    // Shared Components
    ToastComponent,
    LoadingComponent,
    HeaderComponent
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    HeaderComponent,
    DropdownComponent,
    FooterComponent
],
  providers: [
    AuthService,
    ToastComponent
  ]
})
export class SharedModule { }
