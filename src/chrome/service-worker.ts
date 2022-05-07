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
