import { Injectable } from '@angular/core';
import { Logger } from './logging/logger';
import { LoggingService } from './logging/logging.service';
import * as enMessage from '../../_locales/en/messages.json';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  i18n: any[] = [];
  logger: Logger;

  constructor(loggingService: LoggingService) {
    this.logger = loggingService.getLogger('i18n.service');
  }

  get(key: string): string {
    if (chrome?.i18n) {
      return chrome.i18n.getMessage(key);
    }

    this.logger.warn(
      'chrome.i18n is not available in the current context, trying en-US as fallback'
    );
    Object.keys(enMessage).forEach((k) => {});
    for (const [translationKey, translatedText] of Object.entries(enMessage)) {
      if (translationKey === key) {
        return translatedText['message'];
      }
    }

    this.logger.error('No translation available for key', key);
    return key;
  }
}
