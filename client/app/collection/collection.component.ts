import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ShoeService } from 'app/services/shoe.service';
import { combineLatest } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  standalone: false,
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
  selectedSizes: string[] = [];
  sortList: any[] = [{ 'value': 'rel', 'viewValue': 'רלוונטיות' },
                     { 'value': 'new', 'viewValue': 'חדשים' },
                     { 'value': 'priceLow', 'viewValue': 'מחיר - נמוך לגבוהה' },
                     { 'value': 'priceHigh', 'viewValue': 'מחיר - גבוהה לנמוך' }];

  separatorKeysCodes = [ENTER, 188];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private shoeService: ShoeService,
              private titleService: Title,
              private meta: Meta) {
    this.initQueries = '';
    this.queries = [];
    this.filters = [];
    this.sizes = [];
    this.companies = [];
    this.colors = [];
  }

  ngOnInit() {
    this.titleService.setTitle('קולקצית נעליים | נעלי נעורים');
    const obsComb = combineLatest([this.route.params, this.route.queryParams]);
    this.sub1 = obsComb.subscribe(([params, qparams]) => {
      if (qparams.sort) {
        this.sort = qparams.sort;
      }
      this.selectedSizes = qparams.sizes ? qparams.sizes.split(',') : [];
      this.initQueries = params['query'];
      this.queries = this.createSearchQuery(this.initQueries);
      this.queries = this.queries.filter(s => s.indexOf('[') === -1 && s.indexOf(']') === -1);
      this.filters = this.queries;
      this.updateCollection(qparams);
      if (this.queries.length === 1 && this.queries[0] === 'נעליים') {
        this.titleService.setTitle('קטלוג | נעלי נעורים');
      } else {
        this.titleService.setTitle('נעלי ' + this.queries + ' | נעלי נעורים');
      }
      this.meta.updateTag({ name: 'keywords', content: this.buildKeywords(this.queries) });
      this.meta.updateTag({ name: 'description', content: this.buildDescription(this.queries) });
    });
  }

  private buildKeywords(queries: String[]): string {
    const q = queries.join(', ');
    const base = `נעלי ${q}, נעל ${q}, ${q} חולון, קניית נעלי ${q}, נעלי נעורים`;
    const extras: string[] = [];
    if (queries.some(s => s === 'נשים'))   extras.push('נעלי נוחות לנשים, נעלי אורטופדיות לנשים, נעלי נשים מבוגרות');
    if (queries.some(s => s === 'גברים'))  extras.push('נעלי נוחות לגברים, נעלי עור לגברים');
    if (queries.some(s => s === 'ילדים' || s === 'ילדות')) extras.push('נעלי צעד ראשון, נעלי תינוקות, נעלי פעוטות');
    return [base, ...extras].join(', ');
  }

  private buildDescription(queries: String[]): string {
    const q = queries.join(' ');
    return `מבחר נעלי ${q} במחירים מעולים — נעלי נעורים חולון מאז 1965. משלוח עד הבית בקנייה מעל ₪200. ${q} בכל המידות והצבעים.`;
  }

  createSearchQuery(query): any {
    if (!query) { return ['נעליים']; }
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
    this.sub2 = this.shoeService.searchShoes(this.queries, queryString).subscribe(
      data => {
        this.shoes = this.selectedSizes.length > 0
          ? data.filter(shoe =>
              this.selectedSizes.some(size =>
                shoe.imagesGroup?.some(ig => ig.sizes?.some(s => String(s.size) === size))
              )
            )
          : data;
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
    this.sizes = Array.from(sizeSet).sort() as String[];
    this.companies = this.count(companyArray);
    this.colors = this.count(colorArray);
  }

  count(arr) {
    const res = [];
    const newObj = arr.reduce(function(m, e) {
      m[e] = (+m[e] || 0) + 1; return m;
    }, {});
    for (const property in newObj) {
      if (newObj.hasOwnProperty(property)) {
        res.push({ key: property, count: newObj[property] });
      }
    }
    return res;
  }

  removeFilter(filter: string): void {
    if (filter.indexOf(' ') > -1) { filter = '[' + filter + ']'; }
    this.initQueries = this.initQueries.replace(filter, '').trim();
    this.initQueries = this.initQueries.replace('[]', '');
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

  addSizeFilter(size: string) {
    if (!this.selectedSizes.includes(size)) {
      this.selectedSizes = [...this.selectedSizes, size];
    } else {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    }
    this.reload();
  }

  removeSizeFilter(size: string) {
    this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    this.reload();
  }

  reload() {
    let str = '/נעלי/' + (this.initQueries || 'נעליים');
    const params: string[] = [];
    if (this.sort !== 'rel') { params.push('sort=' + this.sort); }
    if (this.selectedSizes.length > 0) { params.push('sizes=' + this.selectedSizes.join(',')); }
    if (params.length > 0) { str += '?' + params.join('&'); }
    this.router.navigateByUrl(str);
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}
