import {
  Component,
  ElementRef,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';
import { Logger } from 'src/app/services/logging/logger';
import { LoggingService } from 'src/app/services/logging/logging.service';

@Component({
  selector: 'audate-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class PageLoaderComponent {
  logger: Logger;
  trustedUrl: SafeResourceUrl;
  isVisible = true;
  focusClass = '';
  drawerClass = '';
  constructor(
    private primengConfig: PrimeNGConfig,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
    elementRef: ElementRef,
    loggingService: LoggingService
  ) {
    this.logger = loggingService.getLogger('page-loader');
    const url = elementRef.nativeElement.getAttribute('url');
    this.trustedUrl = sanitizer.bypassSecurityTrustResourceUrl(url);
    this.listenForUrlUpdates();
  }

  listenForUrlUpdates() {
    const channel = new BroadcastChannel('audate_link_preview');
    channel.onmessage = (e) => {
      this.ngZone.run(() => {
        this.logger.log('Received broadcast to preview', e.data);
        this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.data);
        this.isVisible = true;
        this.focusClass = '';
        this.drawerClass = '';
      });
    };
  }

  onResizeStart(e: any) {
    console.error('resize start', e);
  }
  onResizeEnd(e: any) {
    console.error('resize end', e);
  }
  onShow(e: any) {
    console.error('on show: ', e);
  }
  onHide(e: any) {
    console.error('on hide: ', e);
  }
  onDragEnd(e: any) {
    console.error('on drag end: ', e);
  }
  onMaximize(e: any) {
    console.error('on max: ', e);
  }
  onVisibleChange(isVisible: boolean) {
    this.isVisible = isVisible;
  }
  onMouseOver(unused: MouseEvent) {
    this.focusClass = '';
    this.drawerClass = '';
  }
  onMouseOut(e: MouseEvent) {
    // Ignore mouseout when it's from the right corner.
    if (window.visualViewport.width - e.clientX < 100) {
      return;
    }
    this.focusClass = 'transparent';
    this.drawerClass = 'parked';
  }
}
