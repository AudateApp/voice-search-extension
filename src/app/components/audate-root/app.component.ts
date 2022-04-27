import { Component, isDevMode, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Logger } from 'src/app/services/logging/logger';
import { LoggingService } from 'src/app/services/logging/logging.service';

@Component({
  selector: 'audate-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  logger: Logger;

  constructor(
    private router: Router,
    private primengConfig: PrimeNGConfig,
    loggingService: LoggingService
  ) {
    this.logger = loggingService.getLogger('audate-root');
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.addExtensionRedirects();
  }

  /**
   * Enables navigating to different pages in chrome extension
   * where paths are not supported but fragments are.
   * This function would redirect index.html/#popup
   * (or simply /#popup) to the path /popup.
   */
  addExtensionRedirects() {
    const fragment = window.location.href.split('#')[1];
    switch (fragment) {
      case 'popup':
        this.router.navigateByUrl('popup', { skipLocationChange: true });
        break;
      case 'content-popup':
        this.router.navigateByUrl('content-popup', {
          skipLocationChange: true,
        });
        break;
      case 'options':
        this.router.navigateByUrl('options', { skipLocationChange: true });
        break;
      default:
        this.logger.error('Invalid fragment ', fragment);
    }
  }
}
