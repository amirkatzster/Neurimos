import { Component, OnInit } from '@angular/core';
import { SeoService } from 'app/shared/seo.service';

@Component({
  standalone: false,
  selector: 'app-shoe-sizes',
  templateUrl: './shoe-sizes.component.html',
  styleUrls: ['./shoe-sizes.component.scss']
})
export class ShoeSizesComponent implements OnInit {

  constructor(private seoService: SeoService) { }

  ngOnInit() {
    this.seoService.setCanonical('/סרגל_מידות');
  }

}
