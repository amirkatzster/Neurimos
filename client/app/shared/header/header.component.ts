import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { ClassificationService } from 'app/services/classification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  querySearch: String;
  boys: any;
  girls: any;
  men: any;
  women: any;
  sub: any;
  subRoute: any;
  constructor(public auth: AuthService,
              private classificationService: ClassificationService,
              private route: ActivatedRoute) 
              { }

  ngOnInit() {
    this.subRoute = this.route.params.subscribe(param => {
      this.sub = this.classificationService.getHeader().subscribe(data => {
        this.boys = data.filter(o => o.gen === 'ילדים')[0].cls;
        this.girls = data.filter(o => o.gen === 'ילדות')[0].cls;
        this.men = data.filter(o => o.gen === 'גברים')[0].cls;
        this.women = data.filter(o => o.gen === 'נשים')[0].cls;
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subRoute.unsubscribe();
  }

}
