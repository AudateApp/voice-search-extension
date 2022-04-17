import locales from '../data/locale.json';

// All supported locales for STT - https://cloud.google.com/speech-to-text/docs/languages
// https://docs.google.com/spreadsheets/d/109VdbrRIMspIdKzrcxb6tEG0TxJhwfGLU6pex4Y8zrM/edit#gid=0
export type LocaleProperties = {
  name: string;
  bcp_47: string;
  model:
    | 'Default'
    | 'Command and search'
    | 'Phone call'
    | 'Enhanced phone call'
    | 'Medical Dictation'
    | 'Medical Conversation'
    | 'Enhanced video';
  automatic_punctuation: '' | '✔';
  diarization: '' | '✔';
  boost: '' | '✔';
  word_level_confidence: '' | '✔';
  profanity_filter: '' | '✔';
  spoken_punctuation: '' | '✔';
  spoken_emojis: '' | '✔';
};

// This is a super-long list (over 3K lines), collapse in side panel.
// TODO: Move to separate .json file.
const SupportedLocalesAndProperties: LocaleProperties[] =
  locales as LocaleProperties[];

export const LocalesForDefaultModel = SupportedLocalesAndProperties.filter(
  (l) => l.model === 'Default'
);
export const DefaultLocale = LocalesForDefaultModel.filter(
  (l) => l.bcp_47 === 'en-US'
)[0];

/**
 * Class for answering locale-related questions
 */
export class Locale {
  /**
   * Update the user locale.
   *
   * @param {string} locale
   */
  static setRecognitionLocale(locale: LocaleProperties) {
    chrome.storage.sync
      .set({ voice_recognition_locale: locale })
      .then((savedData:any) => console.log(savedData));
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
      .then((locale:any) => {
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
        (l) => l.bcp_47 == navigator.languages[0]
      );
    } else if (navigator.language) {
      navLocale = LocalesForDefaultModel.find(
        (l) => l.bcp_47 == navigator.language
      );
    }

    if (navLocale) {
      defaultLocale = navLocale;
    }
    console.info("Using locale: ", defaultLocale);
    return defaultLocale;
  }
}
