import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  initQueries: String;
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
              private router: Router,
              private shoeService: ShoeService) {
    this.initQueries = '';
    this.queries = [];
    this.filters = [];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.initQueries = params['query'];
      this.queries = this.createSearchQuery(this.initQueries);
      this.queries = this.queries.filter(s => s.indexOf('[') === -1 && s.indexOf(']') === -1)
      this.filters = this.queries;
      // dispatch action to load the details here.
      this.updateCollection();
   });
  }

  createSearchQuery(query): any {
    let searchQuery = (query.replace(/\s\s+/g, ' ')).trim();
    const matches = searchQuery.match(/\[(.*?)\]/);
    const words = [];
    if (matches) {
      matches.forEach(s => {
        if (s.indexOf('[') > -1) {
          searchQuery.replace(s, ' ');
        } else {
          words.push(s);
        }
      });
    }
    searchQuery = this.replaceAll(searchQuery, ' ', '-').split('-').concat(words);
    return searchQuery;
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
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
  
  saleFilter() {
    this.initQueries += ' SALE';
    this.router.navigateByUrl('/' + this.initQueries);
  }

  removeFilter(filter: string): void {
    if (filter.indexOf(' ') > -1) { filter = '[' + filter + ']'}
    this.initQueries = this.initQueries.replace(filter, '').trim();
    this.router.navigateByUrl('/' + this.initQueries);
  }

  escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  

}
