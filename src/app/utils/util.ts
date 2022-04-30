import { environment } from 'src/environments/environment';

export const getUrlForPath = (path: string) => {
  return `chrome-extension://${environment.extensionId}/index.html#${path}`;
};
