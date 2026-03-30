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
    this.titleService.setTitle('איך להגיע אלינו | נעלי נעורים');
    this.meta.updateTag({ name: 'keywords', content: 'איך להגיע, מפת הגעה, נעלי נעורים, נעליים חולון, צעד ראשון חולון' });
    this.meta.updateTag(
      { name: 'description', content: `כתובתינו שנקר 52 חולון ניתן ללחוץ על כפתור ניווט בדף באמצעות וויז` }
    );
  }

}
