import { environment } from '../environments/environment';

function insertPopup() {
  console.debug('inserting audate popup');
  const audateWrapper = document.createElement('div');
  audateWrapper.className = 'audate-wrapper';
  const shadow = audateWrapper.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <iframe 
        part="audate-frame" 
        allow=""microphone *;"
        src="chrome-extension://${environment.extensionId}/index.html#content-popup"
    ></iframe>`;
  document.body.appendChild(audateWrapper);
}

/*
 * Mic access doesn't yet work with native recognition service.
 * Enable this after custom STT APIs implemented.
 */
if (!environment.production) {
  //   insertPopup();
}
