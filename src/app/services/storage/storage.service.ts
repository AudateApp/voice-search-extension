import { Injectable } from '@angular/core';
import { rejectedSyncPromise } from '@sentry/utils';

/** Provides abstrction for using chrome.storage in extension
 * and localStorage for demos and tests.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  static EXTENSION_ID = 'hcihgccndneebcppakmppfdolodldpge';
  constructor() {
    // TODO: Only when this is the background page should we listen.
    if (chrome?.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(this.onMessage);
    }
  }

  put(key: string, value: any, canDefer = true): Promise<void> {
    console.log('#put', key, value);
    if (!value) {
      return Promise.reject('Attempting to save a null value');
    }

    // Store the data at once if we can access chrome.storage.
    if (chrome.storage) {
      const data: any = {};
      data[key] = value;
      return chrome.storage.sync.set(data);
    }

    // Pass it to the background script to store, if not already in bg-script.
    if (canDefer) {
      return this.sendMessage({
        key: key,
        value: value,
        type: 'save',
      });
    }
    return Promise.reject('Unable to save data');
  }

  // Returns the value for a given key or null if not defined.
  get(key: string, canDefer = true): Promise<any> {
    if (chrome.storage) {
      return chrome.storage.sync.get(key).then((response: any) => {
        // This would return null if key is not defined as response == {}.
        return response[key];
      });
    }

    if (canDefer) {
      return this.sendMessage({
        key: key,
        type: 'read',
      });
    }
    return Promise.reject('Unable to read data');
  }

  // Returns an object containing all key-value pairs saved to storage by this extension.
  getAudateData(canDefer = true): Promise<any> {
    if (chrome.storage) {
      return chrome.storage.sync.get(null);
    }

    if (canDefer) {
      return this.sendMessage({
        key: null,
        type: 'read_all',
      });
    }
    return Promise.reject('Unable to read all data');
  }

  // A promise-wrapper around chrome.runtime.sendMessage.
  sendMessage(message: StorageMessage): Promise<any> {
    let resolve: any, reject: any;
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    chrome.runtime.sendMessage(
      StorageService.EXTENSION_ID,
      message,
      (response) => {
        // Handle platform errors.
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
          return;
        }

        // Handle application-level errors.
        if (response instanceof Error) {
          reject(response.message);
          return;
        }

        resolve(response);
      }
    );
    return promise;
  }

  onMessage = (
    message: StorageMessage,
    sender: chrome.runtime.MessageSender,
    callback: (response?: any) => void
  ) => {
    console.debug('received message: ', message, ' from: ', sender);
    // TODO Ensure sender.id is this extension. Confirm works for content-script.
    switch (message.type) {
      case 'save':
        this.put(message.key!, /* canDefer=*/ message.value).then(
          (response) => callback(response),
          (errorReason) => callback(new Error(errorReason))
        );
        break;
      case 'read':
        this.get(message.key!, /* canDefer=*/ false).then(
          (value) => callback(value),
          (errorReason) => callback(new Error(errorReason))
        );
        break;
      case 'read_all':
        this.getAudateData(/* canDefer=*/ false).then(
          (response) => callback(response),
          (errorReason) => callback(new Error(errorReason))
        );
        break;
      default:
        callback(new Error('Undefined message type: ' + message.type));
        break;
    }
  };
}

export interface StorageMessage {
  type: 'save' | 'read' | 'read_all';
  key: string | null;
  value?: any;
}
