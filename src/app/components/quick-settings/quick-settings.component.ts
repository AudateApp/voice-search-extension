import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocaleProperties, LocalesForDefaultModel, DefaultLocale } from 'src/app/model/locale-properties';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'audate-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss']
})
export class QuickSettingsComponent implements OnInit {

  locales: LocaleProperties[] = LocalesForDefaultModel;
  currentLocale: LocaleProperties = DefaultLocale;

  constructor(
    private localeService: LocaleService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.localeService.getRecognitionLocale().subscribe(locale => {
      this.currentLocale = locale;
      this.ref.detectChanges();
    });
  }
  
  setLocale(locale: LocaleProperties): void {
    this.localeService.setRecognitionLocale(locale);
  }
}
