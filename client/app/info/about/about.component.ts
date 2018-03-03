import { Component, OnInit } from '@angular/core';
import { ShoeService } from 'app/services/shoe.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('אודותינו | נעלי נעורים');
  }
}
