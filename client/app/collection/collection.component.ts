import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import {ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { ShoeService } from 'app/services/shoe.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy {

  private sub: any;
  queries: String[];
  filters: String[];
  shoes: any[];
  isLoading: boolean;
  searchToShow: String[];
  sortList: any[] = [{'value': 'rel' , 'viewValue': 'רלוונטיות'},
                     {'value': 'new' , 'viewValue': 'חדשים'},
                     {'value': 'priceLow' , 'viewValue': 'מחיר - נמוך לגבוהה'},
                     {'value': 'priceHigh' , 'viewValue': 'מחיר - גבוהה לנמוך'}]

  separatorKeysCodes = [ENTER, 188];

  constructor(private route: ActivatedRoute,
              private shoeService: ShoeService) {
    this.queries = [];
    this.filters = [];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const searchQuery = (params['query'].replace(/\s\s+/g, ' ')).trim();
      this.queries = this.replaceAll(searchQuery, ' ', '-').split('-');
      this.filters = this.queries;
      // dispatch action to load the details here.
      this.updateCollection();
   });
  }

  updateCollection() {
    this.shoeService.searchShoes(this.queries).subscribe(
      data => {
         this.shoes = data;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addFilter(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our filter
    if ((value || '').trim()) {
      this.filters.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeFilter(filter: String): void {
    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      this.filters.splice(index, 1);
    }
  }

  escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

}
