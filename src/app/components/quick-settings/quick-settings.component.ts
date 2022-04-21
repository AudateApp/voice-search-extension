import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocaleProperties, LocalesForDefaultModel, DefaultLocale } from 'src/app/model/locale-properties';
import { DefaultSearchEngine, SearchEngine, SearchEngines } from 'src/app/model/search-engine';
import { LocaleService } from 'src/app/services/locale.service';
import { SearchEngineService } from 'src/app/services/search-engine.service';

@Component({
  selector: 'audate-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss']
})
export class QuickSettingsComponent implements OnInit {

  locales: LocaleProperties[] = LocalesForDefaultModel;
  currentLocale: LocaleProperties = DefaultLocale;

  searchEngines: SearchEngine[] = SearchEngines;
  currentSearchEngine: SearchEngine = DefaultSearchEngine;

  constructor(
    private localeService: LocaleService,
    private searchEngineService: SearchEngineService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.localeService.getRecognitionLocale().subscribe(locale => {
      this.currentLocale = locale;
      this.ref.detectChanges();
    });

    this.searchEngineService.getSearchEngine().subscribe(se => {
      this.currentSearchEngine = se;
      this.ref.detectChanges();
    })
  }
  
  setLocale(locale: LocaleProperties): void {
    this.localeService.setRecognitionLocale(locale);
  }
  setSearchEngine(se: SearchEngine): void {
    this.searchEngineService.setSearchEngine(se);
  }
}
