/* This function inserts an Angular custom element (web component) into the DOM. */
function insertCustomElement() {
  console.debug('inserting audate popup');
  const audateWrapper = document.createElement('div');
  audateWrapper.className = 'audate-wrapper';
  const shadow = audateWrapper.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
   <h1>Hello world</h1>`;
  if (!inIframe()) {
    document.body.appendChild(audateWrapper);
  }
}

/*
 * Returns true if this script is running inside an iframe,
 * since the content script is added to all frames.
 */
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

insertCustomElement();
