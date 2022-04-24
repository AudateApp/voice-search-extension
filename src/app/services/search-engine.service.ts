import { Injectable } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import { DefaultSearchEngine, SearchEngine } from '../model/search-engine';
import { Logger } from './logging/logger';
import { LoggingService } from './logging/logging.service';

@Injectable({
  providedIn: 'root',
})
export class SearchEngineService {
  logger: Logger;
  currentSearchEngine = DefaultSearchEngine;
  currentSearchEngine$: Subject<SearchEngine> = new Subject();

  constructor(loggingService: LoggingService) {
    this.logger = loggingService.getLogger('SearchEngService');
    this.currentSearchEngine$.next(this.currentSearchEngine);
  }

  getSearchEngine(): Observable<SearchEngine> {
    return this.currentSearchEngine$.asObservable().pipe(share());
  }

  setSearchEngine(se: SearchEngine) {
    this.currentSearchEngine = se;
    this.currentSearchEngine$.next(this.currentSearchEngine);
  }

  // TODO: Use default provider: https://developer.chrome.com/docs/extensions/reference/search/
  performSearch(query: string): void {
    const url = this.currentSearchEngine.queryTemplate.replace(
      '%QUERY%',
      query
    );

    // TODO: Make NewTab optional.
    (window as any).open(url, '_blank').focus();
  }
}
