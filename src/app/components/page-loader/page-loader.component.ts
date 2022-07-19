import { Component, ViewEncapsulation } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'audate-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class PageLoaderComponent {
  constructor(private primengConfig: PrimeNGConfig) {}
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
}
