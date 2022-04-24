import { Logger } from './logger';

// TODO: Implement this.
export class RemoteLogger implements Logger {
  debug(...logs: unknown[]): void {}
  log(...logs: unknown[]): void {}
  warn(...logs: unknown[]): void {}
  error(...logs: unknown[]): void {}
}
