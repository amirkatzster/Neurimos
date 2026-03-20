import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() condition: boolean;
}
