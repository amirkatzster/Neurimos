import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShoeService } from 'app/services/shoe.service';
import { ToastComponent } from 'app/shared/toast/toast.component';
import { CompanyService } from 'app/services/company.service';
import { ClassificationService } from '../../services/classification.service';

@Component({
  standalone: false,
  selector: 'app-shoes',
  templateUrl: './shoes.component.html',
  styleUrls: ['./shoes.component.scss']
})
export class ShoesComponent implements OnInit, OnDestroy {

  @Input() filterCompany = '';

  sub;
  shoes = [];
  isLoading = true;
  currentShoe;

  get filteredShoes() {
    if (!this.filterCompany) { return this.shoes; }
    return this.shoes.filter(s => s.company === this.filterCompany);
  }

  constructor(private shoeService: ShoeService,
              private companyService: CompanyService,
              private formBuilder: FormBuilder,
              private ClassificationService: ClassificationService,
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

  deleteShoeConfirm(shoe) {
    this.currentShoe = shoe;
    if (confirm('בטוח שרוצים למחוק?')) {
      this.deleteShoe();
    }
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
