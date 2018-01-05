import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoeService } from 'app/services/shoe.service';
import { CompanyService } from 'app/services/company.service';
import { MatSelectChange } from '@angular/material';
import { OrderService } from 'app/services/order.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-shoe-details',
  templateUrl: './shoeDetails.component.html',
  styleUrls: ['./shoeDetails.component.scss']
})
export class ShoeDetailsComponent implements OnInit, OnDestroy {

  private sub: any;
  private subShoe: any;
  private subComp: any;
  shoe: any;
  company: any;
  linkToShoe: String;
  linkToCompany: String;
  currentImageGroup: any;
  currentImage: any;
  selectedSize: String;
  constructor(private route: ActivatedRoute,
              private shoeService: ShoeService,
              public companyService: CompanyService,
              private orderService: OrderService,
              public router: Router,
              private location: Location) { }


  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.subShoe = this.shoeService.getShoeById(params['id']).subscribe(
        data => {
          this.shoe = data;
          const colors = this.shoe.imagesGroup.map(ig => ig.color).join('-');
          this.linkToShoe = `/${this.shoe.company}-${this.shoe.name}-${colors}/נעל/${this.shoe._id}`;
          this.linkToCompany = `/${this.shoe.company}/נעלי`;
          if (params['color']) {
            this.currentImageGroup = this.shoe.imagesGroup.find(ig => ig.color === params['color']);
          } else {
            this.currentImageGroup = this.shoe.imagesGroup[0];
          }
          this.currentImage = this.currentImageGroup.images[0];
          this.subComp = this.companyService.getCompanyById(this.shoe.companyId).subscribe(
            compData => {
              this.company = compData;
            },
            err => console.log(err),
          );
        },
        error => console.log(error),
        //() => this.isLoading = false
      );
   });
  }

  colorChangeEvent(newValue) {
     this.currentImageGroup = this.shoe.imagesGroup.find(ig => ig.color === newValue);
     this.currentImage = this.currentImageGroup.images[0];
     this.selectedSize = null;
  }

  backClicked() {
    this.location.back();
  }

  selectPosition(positionImg) {
    this.currentImage = positionImg;
    return false;
  }

  selectColor(imageGroup) {
    this.currentImageGroup = imageGroup;
    this.currentImage = imageGroup.images[0];
    return false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subShoe.unsubscribe();
    this.subComp.unsubscribe();
  }

  addToCart() {
    this.orderService.newOrder(this.shoe, this.currentImageGroup , this.selectedSize);
    this.router.navigate(['order']);
  }

}
