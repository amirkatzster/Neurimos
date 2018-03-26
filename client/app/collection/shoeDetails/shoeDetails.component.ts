import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoeService } from 'app/services/shoe.service';
import { CompanyService } from 'app/services/company.service';
import { MatSelectChange } from '@angular/material';
import { OrderService } from 'app/services/order.service';
import {Location} from '@angular/common';
import { AuthService } from 'app/services/auth.service';
import { ToastComponent } from 'app/shared/toast/toast.component';
import { Title, Meta } from '@angular/platform-browser';

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
              public orderService: OrderService,
              public router: Router,
              public toast: ToastComponent,
              private location: Location,
              public auth: AuthService,
              private titleService: Title,
              private meta: Meta) {  }


  ngOnInit() {
    this.titleService.setTitle('נעל | נעלי נעורים');
    this.sub = this.route.params.subscribe(params => {
      this.subShoe = this.shoeService.getShoeById(params['id']).subscribe(
        data => {
          this.shoe = data;
          const colors = this.shoe.imagesGroup.map(ig => ig.color).join('-');
          this.linkToShoe = `/${this.shoe.company}-${this.shoe.name}-${colors}/נעל/${this.shoe._id}`;
          this.linkToCompany = `/${this.shoe.company}/נעלי`;
          this.titleService.setTitle(`נעל ${this.shoe.company} ${this.shoe.name} ${colors} | נעלי נעורים`);
          this.meta.updateTag(
            { name: 'description',
              // tslint:disable-next-line:max-line-length
              content: `נעלי ${this.shoe.gender} מבית ${this.shoe.company} לקנות בנעלי נעורים חולון. ${this.shoe.name} צבע ${colors} במחיר ${this.shoe.finalPrice} ש"ח`
            });
          this.meta.updateTag({ name: 'keywords', content: `נעל, ${this.shoe.company}, ${this.shoe.name} , ${colors}` });
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
      );
   });
  }


  loadItemsFn() {
    console.log('carousel load');
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
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subShoe) {
      this.subShoe.unsubscribe();
    }
    if (this.subComp) {
      this.subComp.unsubscribe();
    }
  }

  addToCart() {
    this.orderService.newOrder(this.shoe, this.currentImageGroup , this.selectedSize);
    this.router.navigate(['order']);
  }

  orderMore() {
    this.toast.setMessage('!אנחנו נזמין עוד מהדגם הנוכחי', 'success');
  }

}
