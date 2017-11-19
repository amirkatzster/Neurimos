import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../../app/admin/users/users.component';
import { MenuComponent } from '../../app/admin/menu.component';
import { ShoesComponent } from '../../app/admin/shoes/shoes.component';
import { ShoeService } from '../../app/services/shoe.service';
import { SharedModule } from '../../app/shared/shared.module';
import { CompanyComponent } from '../../app/admin/company/company.component';
import { CompanyService } from '../../app/services/company.service';



@NgModule({
  declarations: [
    UsersComponent,
    MenuComponent,
    ShoesComponent,
    CompanyComponent
],
  exports: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
     ShoeService,
     CompanyService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }
