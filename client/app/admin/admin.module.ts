import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { MenuComponent } from './menu.component';
import { ShoesComponent } from './shoes/shoes.component';
import { ShoeService } from '../services/shoe.service';
import { SharedModule } from '../shared/shared.module';
import { CompanyComponent } from './company/company.component';
import { CompanyService } from '../services/company.service';
import { ClassificationComponent } from './classification/classification.component';
import { ClassificationService } from '../services/classification.service';
import { ShoeEditComponent } from './shoes/shoeEdit/shoeEdit.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UsersComponent,
    MenuComponent,
    ShoesComponent,
    CompanyComponent,
    ClassificationComponent,
    ShoeEditComponent
  ],
  exports: [
    UsersComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    ShoeService,
    CompanyService,
    ClassificationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
