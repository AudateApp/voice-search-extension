/* This function inserts an Angular custom element (web component) into the DOM. */
function insertCustomElement() {
  if (inIframe()) {
    return;
  }

  const stylesheets = `
    <link href="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/content-style.css" rel="stylesheet">
  `;
  const styleRange = document.createRange();
  styleRange.selectNode(document.getElementsByTagName('body').item(0)!);
  const styleFragment = styleRange.createContextualFragment(stylesheets);
  document.body.appendChild(styleFragment);

  const tagString = `
    <audate-page-loader></audate-page-loader>
    <script src="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/runtime.js"></script>
    <script src="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/polyfills.js"></script>
    <script src="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/vendor.js"></script>
    <script src="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/main.js"></script>
  
   `;
  const range = document.createRange();
  range.selectNode(document.getElementsByTagName('body').item(0)!);
  const documentFragment = range.createContextualFragment(tagString);
  const audateWrapper = document.createElement('div');
  // audateWrapper.className = 'audate-wrapper';
  const shadow = audateWrapper.attachShadow({ mode: 'open' });
  shadow.appendChild(documentFragment);
  document.body.appendChild(audateWrapper);
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
