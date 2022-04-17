import { Injectable } from '@angular/core';
import {
  LocaleProperties,
  LocalesForDefaultModel,
  DefaultLocale,
} from '../model/locale-properties';

/**
 * Class for answering locale-related questions
 */
@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  /**
   * Update the user locale.
   *
   * @param {string} locale
   */
  static setRecognitionLocale(locale: LocaleProperties) {
    chrome.storage.sync
      .set({ voice_recognition_locale: locale })
      .then((savedData: any) => console.log(savedData));
  }

  /**
   * Get the recognition language.
   *
   * If it is not set, set it to default locale.
   *
   * // TODO: Return Navigation locale others.
   * @return {string} a BCP-47 locale.
   */
  static getRecognitionLocale(): Promise<LocaleProperties> {
    return chrome.storage.sync
      .get('voice_recognition_locale')
      .then((locale: any) => {
        console.log('#getRecognitionLocale() :', locale);
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
    console.info('Using locale: ', defaultLocale);
    return defaultLocale;
  }
}
