import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyService } from 'app/services/company.service';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  companies = [];
  showPromotion = false;

  slides = [
    { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1440&auto=format&fit=crop', alt: 'נעלי נעורים' },
    { url: 'https://images.unsplash.com/photo-1576133385309-203e67da8e58?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'נעלי אופנה' },
    { url: 'https://images.unsplash.com/photo-1536224980868-c8f9bc0bc523?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'נעלי ספורט' },
    { url: 'https://images.unsplash.com/photo-1638299355778-15fdec0d1a9a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'קולקציה חדשה' },
    { url: 'https://images.unsplash.com/photo-1656859966845-1a2118828822?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'נעלי עיצוב' },
    { url: 'https://images.unsplash.com/photo-1641482851820-bd7f7589f62b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'נעלי קולקציה' },
  ];
  currentSlide = 0;
  private carouselInterval: any;

  constructor(public CompanyService: CompanyService) {}

  ngOnInit() {
    this.loadCompanies();
    this.carouselInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 30000);
  }

  ngOnDestroy() {
    clearInterval(this.carouselInterval);
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
}
