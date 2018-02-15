import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'app/services/company.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  companies = [];
  showPromotion = false;

  constructor(public CompanyService: CompanyService) {

  }

  ngOnInit() {
    this.loadCompanies();
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
