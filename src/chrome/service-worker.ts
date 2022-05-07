import { StorageMessage } from 'src/shared/storage-message';
import { ChromeStorageProvider } from '../shared/chrome-storage-provider';
import { ContextMenu } from './context-menu';

new ContextMenu().init();

const uninstallUrl = 'https://justiceo.github.io/audate-ui/uninstall.html';
const welcomeUrl = 'https://justiceo.github.io/audate-ui/welcome.html';

const onInstalled = (details: chrome.runtime.InstalledDetails) => {
  // On fresh install, open page how to use extension.
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: welcomeUrl,
      active: true,
    });
  }

  /*
   * For updates, show the onboarding again for in-active users.
   * TODO: Implement isActive.
   */
  const isActive = true;
  if (details.reason === 'update' && !isActive) {
    chrome.tabs.create({
      url: welcomeUrl,
      active: true,
    });
  }

  // Set url to take users upon uninstall.
  chrome.runtime.setUninstallURL(uninstallUrl, () => {
    if (chrome.runtime.lastError) {
      console.error('Error setting uninstall URL', chrome.runtime.lastError);
    }
  });
};
chrome.runtime.onInstalled.addListener(onInstalled);

const storageProvider = new ChromeStorageProvider();
const onMessage = (
  message: StorageMessage,
  sender: chrome.runtime.MessageSender,
  callback: (response?: any) => void
) => {
  console.error('received message: ', message, ' from: ', sender);
  // TODO Ensure sender.id is this extension. Confirm works for content-script.
  switch (message.type) {
    case 'save':
      storageProvider.put(message.key!, /* canDefer=*/ message.value).then(
        (response) => callback(response),
        (errorReason) => callback(new Error(errorReason))
      );
      break;
    case 'read':
      storageProvider.get(message.key!).then(
        (value) => callback(value),
        (errorReason) => callback(new Error(errorReason))
      );
      break;
    case 'read_all':
      storageProvider.getAll().then(
        (response) => callback(response),
        (errorReason) => callback(new Error(errorReason))
      );
      break;
    default:
      callback(new Error('Undefined message type: ' + message.type));
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);
