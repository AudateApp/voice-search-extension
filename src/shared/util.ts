import { environment } from '../environments/environment';

export const getUrlForPath = (path: string) => {
  return `chrome-extension://${environment.extensionId}/index.html#${path}`;
};

export const getExtensionBaseUrl = () => {
  return `chrome-extension://${environment.extensionId}`;
};
