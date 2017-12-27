import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-collection-shoe',
  templateUrl: './collectionShoe.component.html',
  styleUrls: ['./collectionShoe.component.scss']
})
export class CollectionShoeComponent implements OnInit {

  @Input() shoe: any;

  linkToDetails: string;
  constructor() { }

  ngOnInit() {
    const colors = this.shoe.imagesGroup.map(ig => ig.color).join('-');
    this.linkToDetails = `/${this.shoe.company}-${this.shoe.name}-${colors}/נעל/${this.shoe._id}/צבע/${this.shoe.imagesGroup[0].color}`;
  }

}
