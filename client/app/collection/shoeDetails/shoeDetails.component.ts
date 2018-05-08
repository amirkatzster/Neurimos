import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoeService } from 'app/services/shoe.service';
import { CompanyService } from 'app/services/company.service';
import { MatSelectChange } from '@angular/material';
import { OrderService } from 'app/services/order.service';
import {Location} from '@angular/common';
import { AuthService } from 'app/services/auth.service';
import { ToastComponent } from 'app/shared/toast/toast.component';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform} from '@angular/core';

@Component({
  selector: 'app-shoe-details',
  templateUrl: './shoeDetails.component.html',
  styleUrls: ['./shoeDetails.component.scss']
})
export class ShoeDetailsComponent implements OnInit, OnDestroy {

  private sub: any;
  private subShoe: any;
  private subComp: any;
  posIndex: number;
  shoe: any;
  company: any;
  linkToShoe: String;
  linkToCompany: String;
  currentImageGroup: any;
  currentImage: any;
  selectedSize: String;
  jsonLdStringifiedObj: String;
  title: string;
  description: string;

  constructor(private route: ActivatedRoute,
              public shoeService: ShoeService,
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
      this.subShoe = this.shoeService.getShoeByFriendlyId(params['id']).subscribe(
        data => {
          this.shoe = data;
          const colors = this.shoe.imagesGroup.map(ig => ig.color).join('-');
          this.linkToShoe = this.shoeService.getShoeLink(this.shoe);
          this.linkToCompany = `/נעלי/${this.shoe.company}/`;
          this.title = `נעל ${this.shoe.company} ${this.shoe.name} ${colors} | נעלי נעורים`;
          this.titleService.setTitle(this.title);
          // tslint:disable-next-line:max-line-length
          this.description = `נעלי ${this.shoe.gender} מבית ${this.shoe.company} לקנות בנעלי נעורים חולון. ${this.shoe.name} צבע ${colors} במחיר ${this.shoe.finalPrice} ש"ח`;
          this.meta.updateTag(
            { name: 'description',
              content: this.description
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
              this.buildJsonLdForGoogle();
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



  backClicked() {
    this.location.back();
  }

  selectPosition(positionImg, posIndex) {
    this.currentImage = positionImg;
    this.posIndex = posIndex;
    return false;
  }

  selectColor(imageGroup, index) {
    this.currentImageGroup = imageGroup;
    if (!this.posIndex || imageGroup.images.length <= this.posIndex) {
      this.posIndex = 0;
    }
    this.currentImage = imageGroup.images[this.posIndex];
    this.location.replaceState(this.shoeService.getShoeLinkByImage(this.shoe, index));
    return false;
  }

  colorChangeEvent(newValue) {
    const ImageGroup = this.shoe.imagesGroup.find(ig => ig.color === newValue);
    const index = this.shoe.imagesGroup.indexOf(ImageGroup);
    return this.selectColor(ImageGroup, index);
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

  buildJsonLdForGoogle(): any {
  const product: any = {
      '@context': 'http://schema.org/',
      '@type': 'Product',
      'name': this.shoe.name,
      'image': [
        this.shoe.imagesGroup[0].images[0].urlSmall,
        this.shoe.imagesGroup[0].images[0].urlMedium,
        this.shoe.imagesGroup[0].images[0].urlLarge,
        this.shoe.imagesGroup[0].images[0].urlXL
       ],
      'description': this.description,
      'sku': this.shoe.id,
      'brand': {
        '@type': 'Thing',
        'name': this.company.name
      },
      // 'aggregateRating': {
      //   '@type': 'AggregateRating',
      //   'ratingValue': '5',
      //   'reviewCount': '4'
      // },
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'ILS',
        'price': this.shoe.finalPrice,
        'itemCondition': 'http://schema.org/NewCondition',
        'availability': this.shoe.stock > 0 ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
        'seller': {
          '@type': 'Organization',
          'name': 'נעלי נעורים'
        }
      }
    }
    this.jsonLdStringifiedObj = JSON.stringify(product);
  }

}
