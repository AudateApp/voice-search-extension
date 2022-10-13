import { Injectable } from '@angular/core';

declare const window: any;
window.dataLayer = window.dataLayer || [];
function gtag(...args: any[]) { window.dataLayer.push(...args); }

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor() {
    gtag('js', new Date());
    gtag('config', 'G-2VCZGVT0KN');
  }

  logStart(event: string): void {
    gtag('event', event, {
      type: "start",
    });
  }

  logMilestone(event: string): void {
    gtag('event', event, {
      type: "milestone",
    });
  }

  logEnd(event: string, status: string): void {
    gtag('event', event, {
      type: "end",
      status: status,
    });
  }
}
