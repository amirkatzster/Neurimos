import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import {ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { ShoeService } from 'app/services/shoe.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { debuglog } from 'util';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy {

  private sub1: any;
  private sub2: any;
  initQueries: String;
  queries: String[];
  filters: String[];
  shoes: any[];
  isLoading: boolean;
  searchToShow: String[];
  sizes: String[];
  companies: any[];
  colors: any[];
  sort: String = 'rel';
  sortList: any[] = [{'value': 'rel' , 'viewValue': 'רלוונטיות'},
                     {'value': 'new' , 'viewValue': 'חדשים'},
                     {'value': 'priceLow' , 'viewValue': 'מחיר - נמוך לגבוהה'},
                     {'value': 'priceHigh' , 'viewValue': 'מחיר - גבוהה לנמוך'}]

  separatorKeysCodes = [ENTER, 188];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private shoeService: ShoeService,
              private titleService: Title) {
    this.initQueries = '';
    this.queries = [];
    this.filters = [];
    this.sizes = [];
    this.companies = [];
    this.colors = [];
  }

  ngOnInit() {
    console.log('sort1...');
    this.titleService.setTitle('קולקצית נעליים | נעלי נעורים');
    const obsComb = Observable.combineLatest(this.route.params, this.route.queryParams,
      (params, qparams) => ({ params, qparams }))
    this.sub1 = obsComb.subscribe( ap => {
      if (ap.qparams.sort) {
        this.sort = ap.qparams.sort;
      }
      this.initQueries = ap.params['query'];
      this.queries = this.createSearchQuery(this.initQueries);
      this.queries = this.queries.filter(s => s.indexOf('[') === -1 && s.indexOf(']') === -1)
      this.filters = this.queries;
      // dispatch action to load the details here.
      this.updateCollection(ap.qparams);
      this.titleService.setTitle('קולקצית נעלי  ' + this.queries + ' | נעלי נעורים');
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

  updateCollection(qs: Params) {
    let queryString = '';
    if (qs.sort) {
      queryString = '?sort=' + qs.sort;
    }
    const test = queryString.toString();
    this.sub2 = this.shoeService.searchShoes(this.queries, queryString).subscribe(
      data => {
         this.shoes = data;
         this.setFilters();
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  setFilters() {
    const sizeSet = new Set();
    const companyArray = [];
    const colorArray = [];
    this.shoes.forEach(s => {
      companyArray.push(s.company);
      if (s.stock > 0) {
        s.imagesGroup.forEach(ig => {
          const separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?'];
          const colors = ig.color.split(new RegExp(separators.join('|'), 'g'));
          colorArray.push(...colors);
          ig.sizes.map(ns => ns.size).forEach(sz => {
            sizeSet.add(sz);
          });
        });
      }
    });
    this.sizes = Array.from(sizeSet).sort();
    this.companies = this.count(companyArray);
    this.colors = this.count(colorArray);
  }

  count(arr) {
    const res = [];
    const newObj = arr.reduce(function(m, e){
      m[e] = (+m[e] || 0) + 1; return m
    }, {});
    for (const property in newObj) {
      if (newObj.hasOwnProperty(property)) {
          res.push({key: property, count : newObj[property]});
      }
  }
    return res;
  }

  removeFilter(filter: string): void {
    if (filter.indexOf(' ') > -1) { filter = '[' + filter + ']'}
    this.initQueries = this.initQueries.replace(filter, '').trim();
    this.initQueries =  this.initQueries.replace('[]', '');
    this.reload();
  }

  addFiler(filter) {
    const filterArray = this.initQueries.split(' ');
    if (filterArray.indexOf(filter) === -1) {
      this.initQueries += ' ' + filter;
    }
    this.reload();
  }



  escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  sortChangeEvent(event) {
    this.reload();
  }

  reload() {
    let str = '/' + this.initQueries;
    if (this.sort !== 'rel') {
      str += '?sort=' + this.sort;
    }
    this.router.navigateByUrl(str);
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
