import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'audate-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class PageLoaderComponent {
  trustedUrl: any;
  isVisible = true;
  focusClass = '';
  drawerClass = '';
  constructor(
    private primengConfig: PrimeNGConfig,
    elementRef: ElementRef,
    sanitizer: DomSanitizer
  ) {
    const url = elementRef.nativeElement.getAttribute('url');
    this.trustedUrl = sanitizer.bypassSecurityTrustResourceUrl(url);
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
