import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ShoeService } from '../../services/shoe.service';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-shoes',
  templateUrl: './shoes.component.html',
  styleUrls: ['./shoes.component.scss']
})
export class ShoesComponent implements OnInit {

  currentShoe: any = {};
  currentShoeIndex: number;
  shoes = [];
  isLoading = true;
  isEditing = false;

  addShoesForm: FormGroup;
  name = new FormControl('', Validators.required);
  age = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);

  constructor(private shoeService: ShoeService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getShoes();
    this.addShoesForm = this.formBuilder.group({
      name: this.name,
      age: this.age,
      weight: this.weight
    });
  }

  getShoes() {
    this.shoeService.getShoes().subscribe(
      data => this.shoes = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addShoe(modal) {
    this.isEditing = true;
    this.currentShoe = { 'active': true};
    this.currentShoeIndex = this.shoes.length;
    modal.open();
  }

  enableEditing(shoe, ind, modal) {
    this.isEditing = true;
    this.currentShoe = JSON.parse(JSON.stringify(shoe));
    this.currentShoeIndex = ind;
    modal.open();
  }

  doneEditShoe(shoe) {
    if (this.shoes.length === this.currentShoeIndex) {
        this.shoeService.addShoe(shoe).subscribe(
        res => {
          this.isEditing = false;
          this.shoes.push(shoe);
          this.toast.setMessage(shoe.id + ' עודכן בהצלחה', 'success');
        },
        error => console.log(error)
      );
    } else {
      this.shoeService.editShoe(shoe).subscribe(
        res => {
          this.isEditing = false;
          this.shoes[this.currentShoeIndex] = shoe;
          this.toast.setMessage(shoe.id + ' עודכן בהצלחה', 'success');
        },
        error => console.log(error)
      );
    }
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
      if (!this.currentShoe.images)
      {
        this.currentShoe.images = [];
      }
      this.currentShoe.images.push(reader.result);
      console.log(this.currentShoe.images.length);
  }

}
