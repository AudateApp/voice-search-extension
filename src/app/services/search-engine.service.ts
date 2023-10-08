import { Injectable } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import { DefaultSearchEngine, SearchEngine } from '../model/search-engine';
import { Logger } from './logging/logger';
import { LoggingService } from './logging/logging.service';
import { StorageService } from './storage/storage.service';
import { LaunchTarget, LaunchTargetService } from './launch-target.service';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root',
})
export class SearchEngineService {
  logger: Logger;
  currentSearchEngine = DefaultSearchEngine;
  currentSearchEngine$: Subject<SearchEngine> = new Subject();

  constructor(
    private storageService: StorageService,
    private launchTargetService: LaunchTargetService,
    private analytics: AnalyticsService,
    loggingService: LoggingService
  ) {
    this.logger = loggingService.getLogger('SearchEngService');

    // Fetch and broadcast saved search engine, set it if not available.
    this.getSavedSearchEngine().then((se) => {
      if (se) {
        this.currentSearchEngine$.next(se);
      } else {
        this.setSearchEngine(DefaultSearchEngine);
      }
    });
    // Update currentSearchEngine everytime search engine changes.
    this.getSearchEngine().subscribe((se) => (this.currentSearchEngine = se));
  }

  getSearchEngine(): Observable<SearchEngine> {
    return this.currentSearchEngine$.asObservable().pipe(share());
  }

  private getSavedSearchEngine(): Promise<SearchEngine> {
    return this.storageService.get('search_engine').then(
      (se: any) => {
        return se as SearchEngine;
      },
      (errorReason) => {
        this.logger.error(
          'Failed to fetch search engine due to error: ',
          errorReason
        );
        this.logger.warn('Using default search engine instead');
        return DefaultSearchEngine;
      }
    );
  }

  setSearchEngine(se: SearchEngine) {
    this.storageService.put('search_engine', se).then(
      () => {
        this.currentSearchEngine$.next(se);
      },
      (error) => {
        this.logger.error(error);
      }
    );
  }

  // TODO: Use default provider: https://developer.chrome.com/docs/extensions/reference/search/
  performSearch(query: string): void {
    const url = this.currentSearchEngine.queryTemplate.replace(
      '%QUERY%',
      query
    );

    this.launchTargetService.getSavedLaunchTarget().then((lt) => {
      switch (lt) {
        case LaunchTarget.CURRENT_TAB:
          this.openInCurrentTab(url);
          break;
        case LaunchTarget.NEW_TAB:
          this.openInNewTab(url);
          break;
        default:
          this.openInNewTab(url);
          break;
      }
    });
  }

  openInNewTab(url: string): void {
    if (!chrome?.tabs) {
      window.open(url, '_blank');
      return;
    }
    chrome.tabs.create({ url: url, active: true }).then(
      () => {
        this.analytics.logEnd('#createNewTab', 'success');
      },
      (err) => {
        this.logger.error('#createTab error', err);
        this.analytics.logEnd('#createNewTab', 'failure');
      }
    );
  }

  openInCurrentTab(url: string): void {
    if (!chrome?.tabs) {
      window.open(url, '_top');
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs.length !== 1) {
        this.logger.error(
          'Wrong number of active tabs, expected 1, got ',
          tabs.length
        );
        this.openInNewTab(url);
        return;
      }
      const tab = tabs[0];
      if (!tab.id) {
        this.logger.error(
          'No tab ID, context is not appropriate to updating tab'
        );
        this.openInNewTab(url);
        return;
      }
      chrome.tabs.update(tab.id, { url: url, active: true }).then(
        () => {
          this.logger.debug('successfully opened url');
          this.analytics.logEnd('#updateTab', 'success');
        },
        (err) => {
          this.logger.error('#performSearch: error opening url', err);
          this.analytics.logEnd('#updateTab', 'failure');
        }
      );
    });
  }
}
