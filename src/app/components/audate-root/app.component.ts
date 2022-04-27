import { Component, isDevMode, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'audate-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'audate';
  display: boolean = true;

  constructor(private router: Router, private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    const fragment = window.location.href.split('#')[1];
    switch (fragment) {
      case 'popup':
        this.router.navigateByUrl('popup', { skipLocationChange: true });
        break;
      case 'options':
        this.router.navigateByUrl('options', { skipLocationChange: true });
        break;
      default:
        console.error('Invalid fragment ', fragment);
        if (isDevMode()) {
          console.error('TODO: Remove using popup for development');
          this.router.navigateByUrl('popup', { skipLocationChange: true });
        }
    }
  }

  showDialog() {
    this.display = true;
  }
}
