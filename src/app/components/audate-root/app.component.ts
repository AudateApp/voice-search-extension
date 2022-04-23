import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { InvocationType } from 'src/app/model/invocation-type';

@Component({
  selector: 'audate-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'audate';
  display: boolean = true;
  @Input() invocationType: InvocationType = InvocationType.UNKNOWN;

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  showDialog() {
    this.display = true;
  }
}
