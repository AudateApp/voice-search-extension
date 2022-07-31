import { computePosition } from '@floating-ui/dom';
import { Message } from 'src/shared/message';
import { getExtensionBaseUrl } from '../shared/util';
import { LoggingService } from './logging-service';

const logger = new LoggingService().getLogger('content-script');

/* This function inserts an Angular custom element (web component) into the DOM. */
function insertPageLoader(url: string) {
  if (inIframe()) {
    return;
  }

  const stylesheets = `
    <link href="${getExtensionBaseUrl()}/content-style.css" rel="stylesheet">
  `;
  const styleRange = document.createRange();
  styleRange.selectNode(document.getElementsByTagName('body').item(0)!);
  const styleFragment = styleRange.createContextualFragment(stylesheets);
  document.body.appendChild(styleFragment);

  const tagString = `
    <audate-page-loader url="${url}"></audate-page-loader>
    <script src="${getExtensionBaseUrl()}/runtime.js"></script>
    <script src="${getExtensionBaseUrl()}/polyfills.js"></script>
    <script src="${getExtensionBaseUrl()}/vendor.js"></script>
    <script src="${getExtensionBaseUrl()}/main.js"></script>
  
   `;
  const range = document.createRange();
  range.selectNode(document.getElementsByTagName('body').item(0)!);
  const documentFragment = range.createContextualFragment(tagString);
  const audateWrapper = document.createElement('div');
  audateWrapper.id = 'audate-preview-container';
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
  ev: MouseEvent | KeyboardEvent,
  selectedText: string
) {
  chrome.runtime.sendMessage({
    key: 'create_search_url_for_query',
    value: selectedText,
  });

  floating.setAttribute('alt', 'Search for ' + selectedText);
  floating.style.display = 'block';
  computePosition(reference, floating, {
    // Try changing this to a different side.
    placement: 'top',
  }).then((unusedRefs) => {
    // TODO: Fix keyboardEvent not working.
    let x = ev instanceof MouseEvent ? ev.pageX : ev.view!.pageXOffset;
    x = x - 20;
    let y = ev instanceof MouseEvent ? ev.pageY : ev.view!.pageYOffset!;
    y = y - 55;
    Object.assign(floating.style, {
      top: `${y}px`,
      left: `${x}px`,
    });
  });
}

function maybeSuggestSearch(
  ev: MouseEvent | KeyboardEvent,
  floating: HTMLElement
) {
  if (typeof window.getSelection == 'undefined') {
    return;
  }
  const selection = window.getSelection()!;
  if (selection.isCollapsed) {
    return;
  }
  if (getLinkTarget(ev)) {
    return;
  }
  logger.debug('Selected: ', selection.toString());
  addSearchButton(
    window.getSelection()!.focusNode!.parentElement,
    floating,
    ev,
    window.getSelection()!.toString()
  );
}

function setUpVoiceSearchListener() {
  const onMessage = (
    message: Message,
    sender: chrome.runtime.MessageSender,
    callback: (response?: any) => void
  ) => {
    logger.log('Received voice search message: ', message, ' from: ', sender);
    // TODO Ensure sender.id is this extension. Confirm works for content-script.
    if (message.key == 'voice_search_query') {
      displayPreview(message.value);
      callback();
    }

    if (message.key === 'encoded_search_url') {
      floating.onclick = (unusedClick) => {
        displayPreview(message.value);
      };
    }
  };
  chrome.runtime.onMessage.addListener(onMessage);
}

function redirectLinks() {
  // If the <a> element contains other elements, we traverse the tree to find the anchor element clicked:
  document.body.addEventListener(
    'click',
    function (e) {
      var targetEl: any = getLinkTarget(e);
      if (targetEl) {
        targetEl.target = '_parent';
      }
    },
    true
  );
}

function displayPreview(url: string) {
  if (document.getElementById('audate-preview-container')) {
    logger.debug('broadcasting the url');
    channel.postMessage(url);
  } else {
    logger.debug('inserting audate preview');
    insertPageLoader(url);
  }
}

// Returns a truthy value (the link element) if event target is a link.
function getLinkTarget(e: MouseEvent | KeyboardEvent): EventTarget | null {
  var target: any = e.target;
  do {
    if (target.nodeName.toUpperCase() === 'A' && target.href) {
      return target;
    }
  } while ((target = target.parentElement));
  return null;
}

// Add floating UI to the DOM.
const floating = document.createElement('div');
floating.className = 'audate-floatie';
floating.setAttribute('role', 'img');
floating.setAttribute('alt', 'Search for selected text');
floating.setAttribute('tabindex', '0');
floating.style.backgroundImage = `url(${getExtensionBaseUrl()}/assets/icons/search-icon.jpeg)`;

function init() {
  if (inIframe()) {
    redirectLinks();
    return;
  }

  // TODO: Hide this at first.
  document.body.appendChild(floating);

  // Listen for all mouse/key up events and suggest search if there's a selection.
  document.onmouseup = (e) => maybeSuggestSearch(e, floating);
  document.onkeyup = (e) => maybeSuggestSearch(e, floating);

  // Listen for voice search from popup.
  setUpVoiceSearchListener();
}
const channel = new BroadcastChannel('audate_link_preview');
init();
