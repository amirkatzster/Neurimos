import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ShoeService } from 'app/services/shoe.service';
import { ToastComponent } from 'app/shared/toast/toast.component';
import { CompanyService } from 'app/services/company.service';
import { ClassificationService } from '../../services/classification.service';
import { debug } from 'util';

@Component({
  selector: 'app-shoes',
  templateUrl: './shoes.component.html',
  styleUrls: ['./shoes.component.scss']
})
export class ShoesComponent implements OnInit , OnDestroy {

  sub;
  shoes = [];
  isLoading = true;
  currentShoe;

  constructor(private shoeService: ShoeService,
              private companyService: CompanyService,
              private formBuilder: FormBuilder,
              private ClassificationService: ClassificationService,
              private http: Http,
              public toast: ToastComponent) {
              }

  ngOnInit() {
    this.getShoes();
  }


  getShoes() {
    this.shoeService.getShoes().subscribe(
      data => {
         this.shoes = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  deleteShoeConfirm(model, shoe) {
    this.currentShoe = shoe;
    model.open();
  }

  deleteShoe() {
    this.sub = this.shoeService.deleteShoe(this.currentShoe).subscribe(
      res => {
        this.toast.setMessage(this.currentShoe.id + ' הוסר בהצלחה', 'success');
        const i = this.shoes.indexOf(this.currentShoe);
        this.shoes.splice(i, 1);
      },
      error => console.log(error)
    );
  }

  ngOnDestroy(): void {
     if (this.sub) {
        this.sub.unsubscribe();
     }
  }
}
