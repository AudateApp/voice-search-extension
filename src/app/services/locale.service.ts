import { Injectable } from '@angular/core';
import { Observable, share, Subject } from 'rxjs';
import {
  LocaleProperties,
  LocalesForDefaultModel,
  DefaultLocale,
} from '../model/locale-properties';
import { Logger } from './logger';
import { LoggingService } from './logging.service';

/**
 * Class for answering locale-related questions
 */
@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  logger: Logger;
  localeSubject$ = new Subject<LocaleProperties>();
  constructor(loggingService: LoggingService) {
    this.logger = loggingService.getLogger("LocaleService");
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
    if (!chrome.storage) {
      this.logger.warn('Locale is not set, only broadcast');
      this.localeSubject$.next(locale);
      return;
    }

    chrome.storage.sync.set({ voice_recognition_locale: locale }).then(
      (savedData: any) => {
        this.logger.log(savedData);
        this.localeSubject$.next(savedData);
      },
      (errorReason) => {
        this.localeSubject$.error(errorReason);
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
    if(!chrome.storage) {
      this.logger.warn("Local not fetched from storage");
      return Promise.resolve(LocaleService.getDefaultLocale());
    }

    return chrome.storage.sync
      .get('voice_recognition_locale')
      .then((locale: any) => {
        this.logger.log('#getRecognitionLocale() :', locale);
        if (!locale) {
          this.setRecognitionLocale(LocaleService.getDefaultLocale());
          return LocaleService.getDefaultLocale();
        }
        return locale as LocaleProperties;
      });
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
