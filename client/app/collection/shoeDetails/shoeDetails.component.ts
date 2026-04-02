import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoeService } from 'app/services/shoe.service';
import { CompanyService } from 'app/services/company.service';
import { MatSelectChange } from '@angular/material/select';
import { OrderService } from 'app/services/order.service';
import { Location, isPlatformBrowser } from '@angular/common';
import { AuthService } from 'app/services/auth.service';
import { ToastComponent } from 'app/shared/toast/toast.component';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform} from '@angular/core';
import { SeoService } from 'app/shared/seo.service';

@Component({
  standalone: false,
  selector: 'app-shoe-details',
  templateUrl: './shoeDetails.component.html',
  styleUrls: ['./shoeDetails.component.scss']
})
export class ShoeDetailsComponent implements OnInit, OnDestroy {

  private sub: any;
  private subShoe: any;
  private subComp: any;
  isLoading = true;
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
  copied = false;
  recommendations: any[] = [];
  private subRec: any;
  touchStartX = 0;

  constructor(private route: ActivatedRoute,
              public shoeService: ShoeService,
              public companyService: CompanyService,
              public orderService: OrderService,
              public router: Router,
              public toast: ToastComponent,
              private location: Location,
              public auth: AuthService,
              private titleService: Title,
              private meta: Meta,
              private seoService: SeoService,
              private ngZone: NgZone,
              @Inject(PLATFORM_ID) private platformId: Object) {  }


  ngOnInit() {
    this.titleService.setTitle('נעל | נעלי נעורים');
    this.sub = this.route.params.subscribe(params => {
      this.isLoading = true;
      this.shoe = null;
      this.company = null;
      this.currentImageGroup = null;
      this.currentImage = null;
      this.subShoe = this.shoeService.getShoeByFriendlyId(params['id']).subscribe(
        data => {
          this.shoe = data;
          const colors = this.shoe.imagesGroup.map(ig => ig.color).join('-');
          this.linkToShoe = this.shoeService.getShoeLink(this.shoe);
          this.linkToCompany = `/נעלי/${this.shoe.company}/`;
          this.seoService.setCanonical(this.linkToShoe as string);
          this.title = `נעל ${this.shoe.company} ${this.shoe.name} ${colors} | נעלי נעורים`;
          this.titleService.setTitle(this.title);
          // tslint:disable-next-line:max-line-length
          this.description = `${this.shoe.company} ${this.shoe.name} — נעלי ${this.shoe.gender} צבע ${colors} במחיר ${this.shoe.finalPrice} ש"ח. קנו בנעלי נעורים חולון עם משלוח עד הבית. מאז 1965.`;
          this.meta.updateTag({ name: 'description', content: this.description });
          this.meta.updateTag({ name: 'keywords', content: `${this.shoe.company}, ${this.shoe.name}, נעלי ${this.shoe.gender}, ${colors}, נעל ${this.shoe.company} חולון, קניית ${this.shoe.company} אונליין, נעלי נעורים, ${this.shoe.company} ${this.shoe.name} מחיר` });
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
              this.isLoading = false;
              this.loadRecommendations();
            },
            err => { console.log(err); this.isLoading = false; },
          );
        },
        error => { console.log(error); this.isLoading = false; },
      );
   });
  }


  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].clientX;
  }

  onTouchEnd(e: TouchEvent) {
    const delta = e.changedTouches[0].clientX - this.touchStartX;
    const images = this.currentImageGroup?.images;
    if (!images || Math.abs(delta) < 40) { return; }
    const current = this.posIndex || 0;
    const next = delta < 0
      ? Math.min(current + 1, images.length - 1)
      : Math.max(current - 1, 0);
    if (next !== current) { this.selectPosition(images[next], next); }
  }

  loadRecommendations() {
    if (this.subRec) { this.subRec.unsubscribe(); }
    const classification = this.shoe?.classificationCache;
    if (!classification) { return; }
    this.subRec = this.shoeService.searchShoes([classification], '?sort=new').subscribe({
      next: (data: any[]) => {
        this.recommendations = (data || []).filter(s => s.id !== this.shoe.id).slice(0, 6);
      },
      error: err => console.log(err)
    });
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
    if (this.subRec) {
      this.subRec.unsubscribe();
    }
    if (this.subComp) {
      this.subComp.unsubscribe();
    }
  }

  addToCart() {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).gtag('event', 'conversion', { send_to: 'AW-1064042889/k27dCOOOjpAcEImDsPsD' });
    }
    this.orderService.newOrder(this.shoe, this.currentImageGroup , this.selectedSize);
    this.router.navigate(['order']);
  }

  orderMore() {
    this.toast.setMessage('!אנחנו נזמין עוד מהדגם הנוכחי', 'success');
  }

  shareUrl() {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2500);
      });
    }
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
