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
  currentImageGroup: any = {};

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
          // count shoes in database * 2 + random number between 10-99 * 3
          this.friendlyId = (data * 2 + (Math.floor(Math.random() * 89) + 10) * 3).toString();
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

  deleteImage(shoe, index, jIndex) {
    const image = shoe.imagesGroup[index].images[jIndex];
    if (image.urlMedium.indexOf('data:image') !== 0) {
      if (!shoe.deleteImages) {
        shoe.deleteImages = [];
      }
      shoe.deleteImages.push(image);
    }
    shoe.imagesGroup[index].images.splice(jIndex, 1);
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
    this.initGroupImages();
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
    this.initGroupImages();
    this.currentShoeIndex = ind;
    modal.open();
  }

  beforeSubmitting(shoe) {
    shoe.gender = this.genders.filter(g => g.mark).map(g => g.name);
    this.genders.forEach(g => g.mark = false);
    let countStock: Number = 0;
    this.currentShoe.imagesGroup.forEach(ig => {
      if (ig.sizeOptions) {
        ig.sizes = [];
        ig.sizeOptions.filter(g => g.mark).forEach(so => {
          countStock += so.amount;
          ig.sizes.push({'size' : so.name , 'amount' : so.amount});
        });
      }
    });
    this.createSearchWords(shoe);
    shoe.stock = countStock;
  }

  createSearchWords(shoe) {
    const searchWords: String[] = ['נעליים'];
    this.classifications.forEach(c => {
      if (c._id === shoe.classification) {
        searchWords.push(c.name);
        shoe.classificationCache = c.name;
      }})
    shoe.company = this.companies.find(c => c._id === shoe.companyId).name;
    searchWords.push(shoe.id);
    shoe.company.split(' ').forEach(element => {
      searchWords.push(element);
    });
    shoe.name.split(' ').forEach(element => {
      searchWords.push(element);
    });
    shoe.gender.forEach(g => searchWords.push(g));
    shoe.imagesGroup.forEach(ig => {
      ig.color.split(' ').forEach(element => {
        searchWords.push(element);
      });
    });
    shoe.searchWords = searchWords;
  }

  doneEditShoe(shoe) {
    this.beforeSubmitting(shoe);
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

  handleInputChange(e, imageGroup) {
    this.currentImageGroup = imageGroup;
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
      this.currentImageGroup.images.push({ 'urlMedium' : reader.result });
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

  initGroupImages() {
    if (!this.currentShoe.imagesGroup || this.currentShoe.imagesGroup.length === 0) {
      this.currentShoe.imagesGroup = [];
      this.currentShoe.imagesGroup.push({'sizes': [], 'images': []});
    }
    this.currentShoe.imagesGroup.forEach(ig => {
      ig.sizeOptions  = [];
      this.sizes.forEach(s => {
        const sizeIndex = ig.sizes.map(igs => igs.size).indexOf(s.toString());
        if (sizeIndex > -1) {
          ig.sizeOptions.push({'name': s, 'mark': true, 'amount': ig.sizes[sizeIndex].amount});
        } else {
          ig.sizeOptions.push({'name': s, 'mark': false, 'amount': 0});
        }
      })});
  }

  addGroupImage() {
    this.currentShoe.imagesGroup.push({'sizes': [], 'images': []});
    this.initGroupImages();
  }

  removeGroupImage(index) {
    this.currentShoe.imagesGroup[index].images.forEach((img , j) => { this.deleteImage(this.currentShoe, index, j) });
    this.currentShoe.imagesGroup.splice(index, 1);
    this.initGroupImages();
  }

  sizeUp(sizeOption) {
    sizeOption.amount++;
    sizeOption.mark = true;
  }

  sizeDown(sizeOption) {
    if (sizeOption.amount > 0) {
      sizeOption.amount--;
      if (sizeOption.amount === 0) {
         sizeOption.mark = false;
      }
    }
  }

  addRemoveDiscount(shoe) {
    if (!this.currentShoe.discount) {
      this.currentShoe.discount = {};
    } else {
      this.currentShoe.discount = null;
    }
  }

}
