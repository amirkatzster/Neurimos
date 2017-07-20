import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from 'app/admin/admin/users.component';
import { MenuComponent } from 'app/admin/menu.component';



@NgModule({
  declarations: [
    UsersComponent,
    MenuComponent
],
  exports: [
    UsersComponent
  ],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }
