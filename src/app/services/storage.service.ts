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
    if (!chrome.storage) {
      if (!canDefer) {
        console.error('Unable to save data.');
        return Promise.reject('Unable to save data');
      }
      return this.sendMessage({
        key: key,
        value: value,
        type: 'save',
      });
    }

    const data: any = {};
    data[key] = value;
    return chrome.storage.sync.set(data);
  }

  // Returns the value for a given key.
  get(key: string, canDefer = true): Promise<any> {
    if (!chrome.storage) {
      if (!canDefer) {
        console.error('Unable to read data.');
        return Promise.reject('Unable to read data');
      }
      return this.sendMessage({
        key: key,
        type: 'read',
      });
    }

    return chrome.storage.sync.get(key).then((data: any) => {
      if (Object.keys(data).length <= 0) {
        throw 'No entry defined for key: ' + key;
      }
      return data[key];
    });
  }

  // Returns an object containing all key-value pairs saved to storage by this extension.
  getAudateData(canDefer = true): Promise<any> {
    console.log('#getAudateData', canDefer);
    if (!chrome.storage) {
      if (!canDefer) {
        console.error('Unable to read all data.');
        return Promise.reject('Unable to read all data');
      }
      return this.sendMessage({
        key: null,
        type: 'read_all',
      });
    }

    return chrome.storage.sync.get(null);
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
    msg: StorageMessage,
    sender: chrome.runtime.MessageSender,
    callback: (data?: any) => void
  ) => {
    console.debug('received message: ', msg, ' from: ', sender);
    // TODO Ensure sender.id is this extension. Confirm works for content-script.
    switch (msg.type) {
      case 'save':
        if (!msg.key || !msg.value) {
          callback(new Error('A valid key+value is required to save data'));
          break;
        }
        this.put(msg.key, /* canDefer=*/ msg.value);
        break;
      case 'read':
        if (!msg.key) {
          callback(new Error('A key is required to read a piece of data'));
          break;
        }
        this.get(msg.key, /* canDefer=*/ false).then(
          (value) => {
            callback(value);
          },
          (errorReason) => {
            callback(new Error(errorReason));
          }
        );
        break;
      case 'read_all':
        this.getAudateData(/* canDefer=*/ false).then(
          (value: any) => {
            callback(value);
          },
          (errorReason) => {
            callback(new Error(errorReason));
          }
        );
        break;
      default:
        callback(new Error('Undefined message type: ' + msg.type));
        break;
    }
  };
}

export interface StorageMessage {
  type: 'save' | 'read' | 'read_all';
  key: string | null;
  value?: any;
}
