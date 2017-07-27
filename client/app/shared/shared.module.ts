import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'hammerjs';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MdInputModule, MdButtonModule, MdCheckboxModule, MdRadioModule, MdAutocompleteModule, MdSelectModule, MdButtonToggleModule,
  MdCardModule, MdChipsModule, MdTableModule, MdDatepickerModule, MdDialogModule, MdExpansionModule, MdGridListModule, MdIconModule,
  MdListModule, MdMenuModule, MdCoreModule, MdPaginatorModule, MdProgressBarModule, MdProgressSpinnerModule, MdRippleModule,
  MdSidenavModule, MdSliderModule, MdSlideToggleModule, MdSnackBarModule, MdSortModule, MdTabsModule, MdToolbarModule, MdTooltipModule,
  MdNativeDateModule, StyleModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    BrowserAnimationsModule,
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdTableModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdCoreModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSnackBarModule,
    MdSortModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdNativeDateModule,
    StyleModule
  ],
  exports: [
    // Shared Modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    BrowserAnimationsModule,
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdTableModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdCoreModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSnackBarModule,
    MdSortModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdNativeDateModule,
    StyleModule,
    // Shared Components
    ToastComponent,
    LoadingComponent
  ],
  declarations: [
    ToastComponent,
    LoadingComponent
],
  providers: [
    ToastComponent
  ]
})
export class SharedModule { }
