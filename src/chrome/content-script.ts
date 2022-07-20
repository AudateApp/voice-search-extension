import { computePosition } from '@floating-ui/dom';
import { Message } from 'src/shared/message';

/* This function inserts an Angular custom element (web component) into the DOM. */
function insertCustomElement(url: string) {
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
    <audate-page-loader url="${url}"></audate-page-loader>
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

function addSearchButton(
  reference: any,
  floating: HTMLElement,
  selectedText: string
) {
  console.error('adding button to', reference);
  floating.innerHTML = 'Search for ' + selectedText;
  chrome.runtime.sendMessage({
    key: 'create_search_url_for_query',
    value: selectedText,
  });

  computePosition(reference, floating, {
    // Try changing this to a different side.
    placement: 'top',
  }).then(({ x, y }) => {
    Object.assign(floating.style, {
      top: `${y}px`,
      left: `${x}px`,
    });
  });
}

function maybeSuggestSearch(floating: HTMLElement) {
  if (typeof window.getSelection == 'undefined') {
    console.error('No selection');
    return;
  }
  const selection = window.getSelection()!;
  if (selection.isCollapsed) {
    console.error('Collapsed selection');
    return;
  }

  console.log('selected: ', selection.toString());
  addSearchButton(
    window.getSelection()!.focusNode!.parentElement,
    floating,
    window.getSelection()!.toString()
  );
}

function setUpVoiceSearchListener() {
  const onMessage = (
    message: Message,
    sender: chrome.runtime.MessageSender,
    callback: (response?: any) => void
  ) => {
    console.error('received message: ', message, ' from: ', sender);
    // TODO Ensure sender.id is this extension. Confirm works for content-script.
    if (message.key == 'voice_search_query') {
      insertCustomElement(message.value);
      callback();
    }

    if (message.key === 'encoded_search_url') {
      floating.onclick = (unusedClick) => {
        insertCustomElement(message.value);
      };
    }
  };
  chrome.runtime.onMessage.addListener(onMessage);
}

// Add floating UI to the DOM.
const floating = document.createElement('div');
floating.innerHTML = 'Search for';
floating.className = 'audate-floatie';

function init() {
  // TODO: Hide this at first.
  document.body.appendChild(floating);

  // Listen for all mouse/key up events and suggest search if there's a selection.
  document.onmouseup = () => maybeSuggestSearch(floating);
  document.onkeyup = () => maybeSuggestSearch(floating);

  // Listen for voice search from popup.
  setUpVoiceSearchListener();
}

init();
