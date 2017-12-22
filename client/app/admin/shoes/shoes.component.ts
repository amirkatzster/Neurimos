import { Component, OnInit } from '@angular/core';
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
export class ShoesComponent implements OnInit {

  currentShoe: any = {};
  currentShoeIndex: number;
  friendlyId: string;
  shoes = [];
  companies = [];
  classifications = [];
  sizes = [];
  genders = [
    {name: 'ילדות', mark: false},
    {name: 'ילדים', mark: false},
    {name: 'נשים', mark: false},
    {name: 'גברים', mark: false}];
  isLoading = true;
  isEditing = false;

  constructor(private shoeService: ShoeService,
              private companyService: CompanyService,
              private formBuilder: FormBuilder,
              private ClassificationService: ClassificationService,
              private http: Http,
              public toast: ToastComponent) {
                this.sizes = new Array(31).fill(0).map((x, i) => i + 19);
              }

  ngOnInit() {
    this.getShoes();
    this.getCompanies();
    this.genFriendlyId();
    this.getClassifications();
  }

  genFriendlyId()  {
      this.shoeService.countShoes().subscribe(
        data => {
          console.log(data);
          // count shoes in database + random number between 10-99
          this.friendlyId = data.toString() + (Math.floor(Math.random() * 89) + 10).toString();
        },
        error => console.log(error),
    );
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

  deleteImage(shoe, index) {
    const image = shoe.images[index];
    if (image.urlMedium.indexOf('data:image') !== 0) {
      if (!shoe.deleteImages) {
        shoe.deleteImages = [];
      }
      shoe.deleteImages.push(image);
    }
    shoe.images.splice(index, 1);
  }


  getCompanies(): any {
    this.companyService.getCompanies().subscribe(
      data => {this.companies = data},
      error => console.log(error)
    )
  }

  addShoe(modal) {
    this.isEditing = true;
    this.currentShoe = { 'active': true , 'id': this.friendlyId };
    this.currentShoeIndex = this.shoes.length;
    modal.open();
  }

  enableEditing(shoe, ind, modal) {
    this.isEditing = true;
    this.currentShoe = JSON.parse(JSON.stringify(shoe));
    if (this.currentShoe.gender) {
       this.genders.forEach(g => {
          if (this.currentShoe.gender.indexOf(g.name) > -1) {
            g.mark = true;
          } else {
            g.mark = false;
          }
      });
   }
    this.currentShoeIndex = ind;
    modal.open();
  }


  doneEditShoe(shoe) {
    debugger;
    shoe.gender = this.genders.filter(g => g.mark).map(g => g.name);
    this.genders.forEach(g => g.mark = false);
    if (this.shoes.length === this.currentShoeIndex) {
        this.shoeService.addShoe(shoe).subscribe(
        res => {
          this.isEditing = false;
          this.shoes.push(shoe);
          this.toast.setMessage(shoe.id + ' עודכן בהצלחה', 'success');
          this.shoeService.getShoe(shoe).subscribe(
            resp => {this.shoes[this.currentShoeIndex] = resp},
            error => console.log(error)
          )
        },
        error => console.log(error)
      );
    } else {
      this.shoeService.editShoe(shoe).subscribe(
        res => {
          this.isEditing = false;
          this.shoes[this.currentShoeIndex] = shoe;
          this.toast.setMessage(shoe.id + ' עודכן בהצלחה', 'success');
          this.shoeService.getShoe(shoe).subscribe(
            resp => {this.shoes[this.currentShoeIndex] = resp},
            error => console.log(error)
          )
        },
        error => console.log(error)
      );
    }
    this.genFriendlyId();
  }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
    }

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
      const reader = e.target;
      if (!this.currentShoe.images) {
        this.currentShoe.images = [];
      }
      this.currentShoe.images.push({ 'urlMedium' : reader.result });
      console.log(this.currentShoe.images.length);
  }

  getClassifications() {
    this.ClassificationService.getClassifications().subscribe(
      data => {
        if (data != null) {
          this.classifications = data;
        }
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

}
