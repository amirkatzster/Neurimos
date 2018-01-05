import { Component, OnInit, Input } from '@angular/core';
import { ShoeService } from 'app/services/shoe.service';

@Component({
  selector: 'app-collection-shoe',
  templateUrl: './collectionShoe.component.html',
  styleUrls: ['./collectionShoe.component.scss']
})
export class CollectionShoeComponent implements OnInit {

  @Input() shoe: any;

  linkToDetails: string;
  constructor(private shoeService: ShoeService) { }

  ngOnInit() {
    this.linkToDetails = this.shoeService.getShoeLink(this.shoe);
  }

}
