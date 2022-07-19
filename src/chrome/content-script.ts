// import '../../node_modules/primeicons/primeicons.css';

/* This function inserts an Angular custom element (web component) into the DOM. */
function insertCustomElement() {
  if (inIframe()) {
    return;
  }
  console.debug('inserting audate popup');

  const tagString = `
  <div class="audate-wrapper">
    <audate-page-loader></audate-page-loader>
    <link href="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/primeicons.css" rel="stylesheet">
    <!-- TODO: Replace styles.css with content-style.css (which is leaner). There are UX glitches without it 
    (no box shadow, radius, see through animation, button unstyled)
    
    <link href="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/primeicons.css" rel="stylesheet">
    <link href="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/content-style.css" rel="stylesheet">
    -->
    <link href="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/styles.css" rel="stylesheet">
    <script src="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/runtime.js"></script>
    <script src="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/polyfills.js"></script>
    <script src="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/vendor.js"></script>
    <script src="chrome-extension://cbihefficekhofanhbnofgkfhdkbhnkg/main.js"></script>
   </div>
   `;
  const range = document.createRange();
  // Make the body of the document become the context node
  range.selectNode(document.getElementsByTagName('body').item(0)!);
  const documentFragment = range.createContextualFragment(tagString);
  document.body.appendChild(documentFragment);
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
