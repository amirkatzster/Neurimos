import { Component, OnInit } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-findus',
  templateUrl: './findus.component.html',
  styleUrls: ['./findus.component.scss']
})
export class FindusComponent implements OnInit {

  lat = 32.0215089;
  lng = 34.7759857;
  zoom = 13;

  constructor(private titleService: Title, private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle('איך להגיע אלינו | נעלי נעורים');
    this.meta.updateTag({ name: 'keywords', content: 'איך להגיע, מפת הגעה, נעלי נעורים, נעליים חולון, צעד ראשון חולון' });
                this.meta.updateTag(
                  { name: 'description',
                    content: `כתובתינו שנקר 52 חולון ניתן ללחוץ על כפתור ניווט בדף באמצעות וויז`
                  });
  }

}
