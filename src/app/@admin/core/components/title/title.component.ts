import { TitleService } from './../../services/title.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  title: string;
  constructor(private titleService: TitleService) {
    // tslint:disable-next-line: no-shadowed-variable
    this.titleService.title$.subscribe((title: string) => this.title = title);
  }
}
