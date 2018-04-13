import { Component, OnInit, Input } from '@angular/core';
import { ShoeService } from 'app/services/shoe.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-collection-shoe',
  templateUrl: './collectionShoe.component.html',
  styleUrls: ['./collectionShoe.component.scss']
})
export class CollectionShoeComponent implements OnInit {

  @Input() shoe: any;

  linkToDetails: string;
  private oneDay: number =  24 * 60 * 60 * 1000;
  private today: Date = new Date();
  private loading = true


  constructor(private shoeService: ShoeService,
              public auth: AuthService) { }

  ngOnInit() {
    this.linkToDetails = this.shoeService.getShoeLink(this.shoe);
  }

  isNew(shoe) {
    const shoeDate = new Date(shoe.inserted);
    const diffDays = Math.round(Math.abs((this.today.getTime() - shoeDate.getTime()) / (this.oneDay)));
    return diffDays <= 30;
  }

  onLoad() {
    this.loading = false;
  }

}
