import { Component, OnInit } from '@angular/core';
import { ShoeService } from 'app/services/shoe.service';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from 'app/shared/seo.service';

@Component({
  standalone: false,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private titleService: Title, private meta: Meta, private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.setCanonical('/about');
    this.titleService.setTitle('אודותינו | נעלי נעורים');
    this.meta.updateTag({ name: 'keywords', content: 'אודותינו, נעלי נעורים, נעליים חולון, צעד ראשון חולון' });
                this.meta.updateTag(
                  { name: 'description',
                    content: `אודות נעלי נעורים בע"מ. עסק נעליים משפחתי מאז 1965. שירות עם חיוך :)`
                  });
  }
}
