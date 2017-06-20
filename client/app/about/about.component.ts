import { Component, OnInit } from '@angular/core';
import { ShoeService } from "app/services/shoe.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit  {

  isLoading = true;
  
  ngOnInit(): void {
    this.shoeService.countShoes().subscribe(
      data => this.shoeCount = data,
      error => console.log(error),
      () => this.isLoading = false
      );
  }

  private shoeCount:number;

  constructor(private shoeService:ShoeService) {}
 


  getShoeNumber()
  {
      return this.shoeCount;
  }

}
