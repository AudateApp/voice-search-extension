import { Logger } from './logger';
import * as Sentry from "@sentry/angular-ivy";

export class RemoteLogger implements Logger {
  debug(...unused: unknown[]): void {
    // Ignore these.
  }
  log(...unused: unknown[]): void {
    // Ignore these.
  }
  warn(...messages: unknown[]): void {
    Sentry.captureMessage(messages.join(","));
  }
  error(...err: unknown[]): void {
    Sentry.captureException(err);
  }
}
