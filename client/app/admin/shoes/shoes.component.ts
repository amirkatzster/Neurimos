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

  shoe = {};
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

  addShoes(shoe) {
   console.log('addEditShoe');
    this.shoeService.addShoe(this.addShoesForm.value).subscribe(
      res => {
        console.log('addEditShoe2');
        const newShoes = res.json();
        this.shoes.push(newShoes);
        this.addShoesForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(shoe, modal) {
    this.isEditing = true;
    this.shoe = shoe;
    modal.open();
  }

  addEditShoe(shoe) {
    this.shoeService.editShoe(shoe).subscribe(
      res => {
        this.isEditing = false;
        this.shoe = shoe;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

}
