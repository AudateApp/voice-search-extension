/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
/**
 * Simple util for logging to console.
 *
 * Ensure output level is set to 'verbose' to see debug logs.
 */
export interface Logger {
    debug(...logs: unknown[]): void;
    log(...logs: unknown[]): void;
    warn(...logs: unknown[]): void;
    error(...logs: unknown[]): void;
}

// TODO: Implement this.
export class RemoteLogger implements Logger {
    debug(...logs: unknown[]): void {}
    log(...logs: unknown[]): void {}
    warn(...logs: unknown[]): void {}
    error(...logs: unknown[]): void {}
}

export class ConsoleLogger implements Logger {
  tag = '';

  constructor(tag: string) {
    this.tag = tag;
  }

  debug(...logs: unknown[]) {
    const d = new Date(Date.now());
    console.debug(
      '%c%s %s',
      'color: blue',
      `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`,
      this.tag,
      ...logs
    );
  }

  log(...logs: unknown[]) {
    const d = new Date(Date.now());
    console.log(
      '%c%s %s',
      'color: blue',
      `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`,
      this.tag,
      ...logs
    );
  }

  warn(...logs: unknown[]) {
    const d = new Date(Date.now());
    console.warn(
      '%c%s %s',
      'color: blue',
      `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`,
      this.tag,
      ...logs
    );
  }

  error(...logs: unknown[]) {
    const d = new Date(Date.now());
    console.error(
      '%c%s %s',
      'color: blue',
      `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`,
      this.tag,
      ...logs
    );
  }
}
