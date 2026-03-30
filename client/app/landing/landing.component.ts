import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CompanyService } from 'app/services/company.service';
import { ShoeService } from 'app/services/shoe.service';
import { SeoService } from 'app/shared/seo.service';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  companies = [];
  newArrivals: any[] = [];
  showPromotion = false;

  slides = [
    { url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1440&auto=format&fit=crop', alt: 'נעלי צבעוניות' },
    { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1440&auto=format&fit=crop', alt: 'נעלי נעורים' },
    { url: 'https://images.unsplash.com/photo-1576133385309-203e67da8e58?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'נעלי אופנה' },
    { url: 'https://images.unsplash.com/photo-1536224980868-c8f9bc0bc523?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'נעלי ספורט' },
    { url: 'https://images.unsplash.com/photo-1638299355778-15fdec0d1a9a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'קולקציה חדשה' },
    { url: 'https://images.unsplash.com/photo-1656859966845-1a2118828822?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'נעלי עיצוב' },
    { url: 'https://images.unsplash.com/photo-1641482851820-bd7f7589f62b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'נעלי קולקציה' },
  ];
  currentSlide = 0;
  isPlaying = true;
  private carouselInterval: any;

  readonly localBusinessJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ShoeStore'],
    'name': 'נעלי נעורים',
    'url': 'https://www.neurimshoes.co.il',
    'telephone': '03-5052769',
    'image': 'https://www.neurimshoes.co.il/assets/images/og-image.jpg',
    'foundingDate': '1965',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'שדרות ירושלים 47',
      'addressLocality': 'חולון',
      'addressCountry': 'IL'
    },
    'openingHoursSpecification': [
      { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Sunday','Monday','Tuesday','Wednesday','Thursday'], 'opens': '09:00', 'closes': '19:00' },
      { '@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Friday', 'opens': '09:00', 'closes': '14:00' }
    ]
  });

  constructor(
    public CompanyService: CompanyService,
    private shoeService: ShoeService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.seoService.setCanonical('/');
    this.loadCompanies();
    this.loadNewArrivals();
    if (isPlatformBrowser(this.platformId)) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        this.startCarousel();
      } else {
        this.isPlaying = false;
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.carouselInterval);
  }

  private startCarousel() {
    this.ngZone.runOutsideAngular(() => {
      this.carouselInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        });
      }, 3000);
    });
    this.isPlaying = true;
  }

  toggleCarousel() {
    if (this.isPlaying) {
      clearInterval(this.carouselInterval);
      this.isPlaying = false;
    } else {
      this.startCarousel();
    }
  }

  loadCompanies() {
    this.CompanyService.getCompanies().subscribe(
      data => {
        if (data != null) {
          this.companies = data;
        }
      },
      error => console.log(error)
    );
  }

  loadNewArrivals() {
    this.shoeService.searchShoes(['נעלי'], '?sort=new').subscribe({
      next: (data: any[]) => {
        if (data) { this.newArrivals = data.slice(0, 8); }
      },
      error: err => console.log(err)
    });
  }
}
