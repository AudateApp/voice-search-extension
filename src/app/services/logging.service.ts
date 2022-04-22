import { Injectable, isDevMode } from '@angular/core';
import { ConsoleLogger, Logger, RemoteLogger } from './logger';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  getLogger(tag: string): Logger {
    if (isDevMode()) {
      return new ConsoleLogger(tag);
    } else {
      return new RemoteLogger();
    }
  }
}
