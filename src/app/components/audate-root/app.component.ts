import {
  Component,
  ElementRef,
  Input,
  isDevMode,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() invocationType: InvocationType;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private primengConfig: PrimeNGConfig
  ) {
    this.invocationType =
      elementRef.nativeElement.getAttribute('invocationType');
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    switch (this.invocationType) {
      case InvocationType.BACKGROUND_PAGE:
        this.router.navigate(['background']).then(
          (result) => {
            if (!result) {
              console.error('Failed to navigate to background page');
            }
          },
          (errorReason) => console.error(errorReason)
        );
        break;
      case InvocationType.OPTIONS_PAGE:
        this.router.navigate(['options']).then(
          (result) => {
            if (!result) {
              console.error('Failed to navigate to options page');
            }
          },
          (errorReason) => console.error(errorReason)
        );
        break;
      case InvocationType.BROWSER_ACTION:
        this.router.navigate(['popup']).then(
          (result) => {
            if (!result) {
              console.error('Failed to navigate to popup page');
            }
          },
          (errorReason) => console.error(errorReason)
        );
        break;
      default:
        console.error('Unhandled invocation type ', this.invocationType);
        if (this.invocationType == null && isDevMode()) {
          console.error('TODO: Remove using popup for development');
          this.router.navigate(['popup']).then(
            (result) => {
              if (!result) {
                console.error('Failed to navigate to popup page');
              }
            },
            (errorReason) => console.error(errorReason)
          );
        }
        break;
    }
  }

  showDialog() {
    this.display = true;
  }
}
