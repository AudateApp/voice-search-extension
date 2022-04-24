import { StorageProvider } from './storage-provider';
import { StorageMessage } from './storage-message';

export class ChromeStorageProvider implements StorageProvider {
  storageService!: chrome.storage.SyncStorageArea;
  constructor() {
    this.storageService = chrome.storage.sync;
    chrome.runtime.onMessage.addListener(this.onMessage);
  }
  put(key: string, value: any): Promise<void> {
    if (!value) {
      return Promise.reject('Attempting to save a null value');
    }

    const data: any = {};
    data[key] = value;
    return this.storageService.set(data);
  }

  async get(key: string): Promise<any> {
    const response = await this.storageService.get(key);
    return response[key];
  }

  getAll(): Promise<any> {
    return this.storageService.get(null);
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
        this.get(message.key!).then(
          (value) => callback(value),
          (errorReason) => callback(new Error(errorReason))
        );
        break;
      case 'read_all':
        this.getAll().then(
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
