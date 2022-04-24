import { Injectable } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import {
  LocaleProperties,
  LocalesForDefaultModel,
  DefaultLocale,
} from '../model/locale-properties';
import { Logger } from './logging/logger';
import { LoggingService } from './logging/logging.service';
import { StorageService } from './storage/storage.service';

/**
 * Class for answering locale-related questions
 */
@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  logger: Logger;
  localeSubject$ = new Subject<LocaleProperties>();
  constructor(
    loggingService: LoggingService,
    private storageService: StorageService
  ) {
    this.logger = loggingService.getLogger('LocaleService');
    this.getLocale().then((l) => {
      this.localeSubject$.next(l);
    });
  }
  /**
   * Update the user locale.
   *
   * @param {string} locale
   */
  setRecognitionLocale(locale: LocaleProperties) {
    this.storageService.put('locale', locale).then(
      () => {
        this.localeSubject$.next(locale);
      },
      (error) => {
        this.logger.error(error);
        this.localeSubject$.error(error);
      }
    );
  }

  /** Return an observable over locale data. */
  getRecognitionLocale(): Observable<LocaleProperties> {
    return this.localeSubject$.asObservable().pipe(share());
  }

  /**
   * Get the recognition language.
   *
   * If it is not set, set it to default locale.
   * @return {string} a BCP-47 locale.
   */
  private getLocale(): Promise<LocaleProperties> {
    return this.storageService.get('voice_recognition_locale').then(
      (locale: any) => {
        this.logger.log('#getRecognitionLocale() :', locale);
        return locale as LocaleProperties;
      },
      (errorReason) => {
        this.logger.error('Failed to fetch locale due to error: ', errorReason);
        this.logger.warn('Using default locale instead');
        return LocaleService.getDefaultLocale();
      }
    );
  }

  /**
   * Get the locale from the browser.
   *
   * @return {string} a BCP-47 locale.
   */
  static getDefaultLocale(): LocaleProperties {
    let defaultLocale = DefaultLocale;

    // Navigator.language returns the preferred language of the user for the browser UI.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language.
    let navLocale = undefined;
    if (navigator.languages !== undefined) {
      navLocale = LocalesForDefaultModel.find(
        (l: LocaleProperties) => l.bcp_47 == navigator.languages[0]
      );
    } else if (navigator.language) {
      navLocale = LocalesForDefaultModel.find(
        (l: LocaleProperties) => l.bcp_47 == navigator.language
      );
    }

    if (navLocale) {
      defaultLocale = navLocale;
    }
    return defaultLocale;
  }
}
