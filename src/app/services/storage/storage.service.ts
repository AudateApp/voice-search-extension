import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { rejectedSyncPromise } from '@sentry/utils';
import { ChromeStorageProvider } from './chrome-storage-provider';
import { LocalStorageProvider } from './local-storage-provider';
import { RelayStorageProvider } from './relay-storage-provider';
import { StorageProvider } from './storage-provider';

/** Provides abstrction for using chrome.storage in extension
 * and localStorage for demos and tests.
 *
 * TODO: Consider using https://github.com/fregante/webext-detect-page/blob/main/index.ts
 * to determine the current page context.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService implements StorageProvider {
  storageProvider: StorageProvider;
  constructor(private router: Router) {
    if (this.router.url == '/popup') {
      this.storageProvider = new RelayStorageProvider();
    } else if (this.router.url === '/background') {
      this.storageProvider = new ChromeStorageProvider();
    } else {
      this.storageProvider = new LocalStorageProvider();
    }
  }

  put(key: string, value: any): Promise<void> {
    return this.storageProvider.put(key, value);
  }
  get(key: string): Promise<any> {
    return this.storageProvider.get(key);
  }
  getAll(): Promise<any> {
    return this.storageProvider.getAll();
  }
}
export interface StorageMessage {
  type: 'save' | 'read' | 'read_all';
  key: string | null;
  value?: any;
}
