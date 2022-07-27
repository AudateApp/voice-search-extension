import { Injectable } from '@angular/core';
import { logger } from '@sentry/utils';
import { Observable, share, Subject } from 'rxjs';
import { DefaultSearchEngine, SearchEngine } from '../model/search-engine';
import { Logger } from '../../shared/logging/logger';
import { LoggingService } from './logging/logging.service';
import { StorageService } from './storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SearchEngineService {
  logger: Logger;
  currentSearchEngine = DefaultSearchEngine;
  currentSearchEngine$: Subject<SearchEngine> = new Subject();
  // TODO: Make this a setting.
  shouldOpenInNewTab = false;

  constructor(
    private storageService: StorageService,
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

    if (this.shouldOpenInNewTab) {
      (window as any).open(url, '_blank').focus();
    } else {
      // Open the query as a preview in the current tab.
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        if (!activeTab.id) {
          logger.error('Active tab does not have an ID');
          return;
        }
        chrome.tabs.sendMessage(
          activeTab.id,
          {
            key: 'voice_search_query',
            value: url,
          },
          () => {
            // TODO: close popup.
          }
        );
      });
    }
  }
}
