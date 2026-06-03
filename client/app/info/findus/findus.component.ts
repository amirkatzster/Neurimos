import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from 'app/shared/seo.service';

@Component({
  standalone: false,
  selector: 'app-findus',
  templateUrl: './findus.component.html',
  styleUrls: ['./findus.component.scss']
})
export class FindusComponent implements OnInit {

  constructor(private titleService: Title, private meta: Meta, private seoService: SeoService) { }

  ngOnInit() {
    this.seoService.setCanonical('/findus');
    this.titleService.setTitle('נעלי נוחות בחולון — נעלי נעורים | איך להגיע');
    this.meta.updateTag({ name: 'keywords', content: 'נעלי נוחות בחולון, חנות נעליים חולון, נעליים למבוגרים חולון, שנקר 52 חולון, איך להגיע, מפת הגעה, נעלי נעורים' });
    this.meta.updateTag({ name: 'description', content: 'נעלי נעורים — חנות נעלי נוחות בחולון. שנקר 52, חולון. נעליים למבוגרים, לנשים, גברים וילדים. טלפון: 03-5052769. ניווט בוויז ו-Google Maps.' });
  }

}
