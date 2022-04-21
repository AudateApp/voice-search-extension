import { Injectable } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import { DefaultSearchEngine, SearchEngine } from '../model/search-engine';

@Injectable({
  providedIn: 'root'
})
export class SearchEngineService {

  currentSearchEngine = DefaultSearchEngine;
  currentSearchEngine$: Subject<SearchEngine> = new Subject();

  constructor() { 
    this.currentSearchEngine$.next(this.currentSearchEngine);
  }

  getSearchEngine(): Observable<SearchEngine> {
    return this.currentSearchEngine$.asObservable().pipe(share());
  }

  setSearchEngine(se: SearchEngine) {
    this.currentSearchEngine = se;
    this.currentSearchEngine$.next(this.currentSearchEngine);
  }

  getSearchUrl(query: string) {
    return this.currentSearchEngine.queryTemplate.replace("%QUERY%", query);
  }
}
