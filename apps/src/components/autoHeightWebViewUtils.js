"use strict";

import { Dimensions } from "react-native";

export const topic = "rnaw";
export const topicString = `"${topic}"`;

const domMutationObserveScript = `
  var MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(updateSize);
  observer.observe(document, {
    subtree: true,
    attributes: true
  });
`;

const updateSizeWithMessage = (element, scalesPageToFit) =>
  `
  var usingScale = ${scalesPageToFit} ? screen.width / window.innerWidth : 1;
  var scaling = false;
  var zoomedin = false;
  var lastHeight = 0;
  var heightTheSameTimes = 0;
  var maxHeightTheSameTimes = 5;
  var forceRefreshDelay = 1000;
  var forceRefreshTimeout;
  var checkPostMessageTimeout;

  function updateSize() {
    if (zoomedin || scaling || document.fullscreenElement) {
      return;
    }
    if (
      !window.hasOwnProperty('ReactNativeWebView') || 
      !window.ReactNativeWebView.hasOwnProperty('postMessage')
    ) {
      checkPostMessageTimeout = setTimeout(updateSize, 200);
      return;
    }

    clearTimeout(checkPostMessageTimeout);
    var result = ${element}.getBoundingClientRect()
    height = result.height + result.top;
    if(!height) {
      height = ${element}.offsetHeight || document.documentElement.offsetHeight
    }
    width = result.width;
    if(!width) {
      width = ${element}.offsetWidth || document.documentElement.offsetWidth
    }


    window.ReactNativeWebView.postMessage(JSON.stringify({ width: Math.min(width, screen.width), height: height * usingScale, topic: ${topicString} }));

    // Make additional height checks (required to fix issues wit twitter embeds)
    clearTimeout(forceRefreshTimeout);

    if (lastHeight !== height) {
      heightTheSameTimes = 1;
    } else {
      heightTheSameTimes++;
    }

    lastHeight = height;

    if (heightTheSameTimes <= maxHeightTheSameTimes) {
      forceRefreshTimeout = setTimeout(
        updateSize,
        heightTheSameTimes * forceRefreshDelay
      );
    }
  }
  `;

const setViewportContent = (content) => {
  if (!content) {
    return "";
  }
  return `
    var meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", "${content}");
    document.getElementsByTagName("head")[0].appendChild(meta);
  `;
};

const detectZoomChanged = `
  var latestTapStamp = 0;
  var lastScale = 1.0;
  var doubleTapDelay = 400;
  function detectZoomChanged() {
    var tempZoomedin = (screen.width / window.innerWidth) > usingScale;
    tempZoomedin !== zoomedin && window.ReactNativeWebView.postMessage(JSON.stringify({ zoomedin: tempZoomedin, topic: ${topicString} }));
    zoomedin = tempZoomedin;
  }
  window.addEventListener('ontouchstart', event => {
    if (event.touches.length === 2) {
      scaling = true;
    }
  })
  window.addEventListener('touchend', event => {
    if(scaling) {
      scaleing = false;
    }

    var tempScale = event.scale; 
    tempScale !== lastScale && detectZoomChanged();
    lastScale = tempScale;
    var timeSince = new Date().getTime() - latestTapStamp;

    // double tap   
    if(timeSince < 600 && timeSince > 0) {
      zoomedinTimeOut = setTimeout(() => {
        clearTimeout(zoomedinTimeOut);
        detectZoomChanged();
      }, doubleTapDelay);
    }

    latestTapStamp = new Date().getTime();
  });
`;

const longPress = `
(function (window, document) {

  'use strict';

  // local timer object based on rAF
  var timer = null;

  // check if we're using a touch screen
  var hasPointerEvents = (('PointerEvent' in window) || (window.navigator && 'msPointerEnabled' in window.navigator));
  var isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

  // switch to pointer events or touch events if using a touch screen
  var mouseDown = hasPointerEvents ? 'pointerdown' : isTouch ? 'touchstart' : 'mousedown';
  var mouseUp = hasPointerEvents ? 'pointerup' : isTouch ? 'touchend' : 'mouseup';
  var mouseMove = hasPointerEvents ? 'pointermove' : isTouch ? 'touchmove' : 'mousemove';
  var mouseLeave = hasPointerEvents ? 'pointerleave' : isTouch ? 'touchleave' : 'mouseleave';

  // track number of pixels the mouse moves during long press
  var startX = 0; // mouse x position when timer started
  var startY = 0; // mouse y position when timer started
  var maxDiffX = 10; // max number of X pixels the mouse can move during long press before it is canceled
  var maxDiffY = 10; // max number of Y pixels the mouse can move during long press before it is canceled

  // patch CustomEvent to allow constructor creation (IE/Chrome)
  if (typeof window.CustomEvent !== 'function') {

      window.CustomEvent = function (event, params) {

          params = params || { bubbles: false, cancelable: false, detail: undefined };

          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
      };

      window.CustomEvent.prototype = window.Event.prototype;
  }

  // requestAnimationFrame() shim by Paul Irish
  window.requestAnimFrame = (function () {
      return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame || function (callback) {
              window.setTimeout(callback, 1000 / 60);
          };
  })();

  /**
   * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
   * @param {function} fn The callback function
   * @param {int} delay The delay in milliseconds
   * @returns {object} handle to the timeout object
   */
  function requestTimeout(fn, delay) {

      if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame &&
          !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
          !window.oRequestAnimationFrame && !window.msRequestAnimationFrame) return window.setTimeout(fn, delay);

      var start = new Date().getTime();
      var handle = {};

      var loop = function () {
          var current = new Date().getTime();
          var delta = current - start;

          if (delta >= delay) {
              fn.call();
          }
          else {
              handle.value = requestAnimFrame(loop);
          }
      };

      handle.value = requestAnimFrame(loop);

      return handle;
  }

  /**
   * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
   * @param {object} handle The callback function
   * @returns {void}
   */
  function clearRequestTimeout(handle) {
      if (handle) {
          window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
              window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
                  window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
                      window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
                          window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
                              window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
                                  clearTimeout(handle);
      }
  }

  /**
   * Fires the 'long-press' event on element
   * @param {MouseEvent|PointerEvent|TouchEvent} originalEvent The original event being fired
   * @returns {void}
   */
  function fireLongPressEvent(originalEvent) {

      clearLongPressTimer();

      originalEvent = unifyEvent(originalEvent);

      // fire the long-press event
      var allowClickEvent = this.dispatchEvent(new CustomEvent('long-press', {
          bubbles: true,
          cancelable: true,

          // custom event data (legacy)
          detail: {
              clientX: originalEvent.clientX,
              clientY: originalEvent.clientY,
              offsetX: originalEvent.offsetX,
              offsetY: originalEvent.offsetY,
              pageX: originalEvent.pageX,
              pageY: originalEvent.pageY
          },

          // add coordinate data that would typically acompany a touch/click event
          clientX: originalEvent.clientX,
          clientY: originalEvent.clientY,
          offsetX: originalEvent.offsetX,
          offsetY: originalEvent.offsetY,
          pageX: originalEvent.pageX,
          pageY: originalEvent.pageY,
          screenX: originalEvent.screenX,
          screenY: originalEvent.screenY
      }));

      if (!allowClickEvent) {
          // suppress the next click event if e.preventDefault() was called in long-press handler
          document.addEventListener('click', function suppressEvent(e) {
              document.removeEventListener('click', suppressEvent, true);
              cancelEvent(e);
          }, true);
      }
  }

  /**
   * consolidates mouse, touch, and Pointer events
   * @param {MouseEvent|PointerEvent|TouchEvent} e The original event being fired
   * @returns {MouseEvent|PointerEvent|Touch}
   */
  function unifyEvent(e) {
      if (e.changedTouches !== undefined) {
          return e.changedTouches[0];
      }
      return e;
  }

  /**
   * method responsible for starting the long press timer
   * @param {event} e - event object
   * @returns {void}
   */
  function startLongPressTimer(e) {

      clearLongPressTimer(e);

      var el = e.target;

      // get delay from html attribute if it exists, otherwise default to 1000
      var longPressDelayInMs = parseInt(getNearestAttribute(el, 'data-long-press-delay', '1000'), 10); // default 1000

      // start the timer
      timer = requestTimeout(fireLongPressEvent.bind(el, e), longPressDelayInMs);
  }

  /**
   * method responsible for clearing a pending long press timer
   * @param {event} e - event object
   * @returns {void}
   */
  function clearLongPressTimer(e) {
      clearRequestTimeout(timer);
      timer = null;
  }

  /**
  * Cancels the current event
  * @param {object} e - browser event object
  * @returns {void}
  */
  function cancelEvent(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
  }

  /**
   * Starts the timer on mouse down and logs current position
   * @param {object} e - browser event object
   * @returns {void}
   */
  function mouseDownHandler(e) {
      startX = e.clientX;
      startY = e.clientY;
      startLongPressTimer(e);
  }

  /**
   * If the mouse moves n pixels during long-press, cancel the timer
   * @param {object} e - browser event object
   * @returns {void}
   */
  function mouseMoveHandler(e) {

      // calculate total number of pixels the pointer has moved
      var diffX = Math.abs(startX - e.clientX);
      var diffY = Math.abs(startY - e.clientY);

      // if pointer has moved more than allowed, cancel the long-press timer and therefore the event
      if (diffX >= maxDiffX || diffY >= maxDiffY) {
          clearLongPressTimer(e);
      }
  }

  /**
   * Gets attribute off HTML element or nearest parent
   * @param {object} el - HTML element to retrieve attribute from
   * @param {string} attributeName - name of the attribute
   * @param {any} defaultValue - default value to return if no match found
   * @returns {any} attribute value or defaultValue
   */
  function getNearestAttribute(el, attributeName, defaultValue) {

      // walk up the dom tree looking for data-action and data-trigger
      while (el && el !== document.documentElement) {

          var attributeValue = el.getAttribute(attributeName);

          if (attributeValue) {
              return attributeValue;
          }

          el = el.parentNode;
      }

      return defaultValue;
  }

  // hook events that clear a pending long press event
  document.addEventListener(mouseUp, clearLongPressTimer, true);
  document.addEventListener(mouseLeave, clearLongPressTimer, true);
  document.addEventListener(mouseMove, mouseMoveHandler, true);
  document.addEventListener('wheel', clearLongPressTimer, true);
  document.addEventListener('scroll', clearLongPressTimer, true);

  // hook events that can trigger a long press event
  document.addEventListener(mouseDown, mouseDownHandler, true); // <- start

}(window, document));
`;

const getBaseScript = ({
  viewportContent,
  scalesPageToFit,
  scrollEnabledWithZoomedin,
}) =>
  `
  ;
  var wrapper = document.getElementById("rnahw-wrapper");
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'rnahw-wrapper';
    while (document.body.firstChild instanceof Node) {
      wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
  }
  ${updateSizeWithMessage("wrapper", scalesPageToFit)}
  window.addEventListener('load', updateSize);
  window.addEventListener('resize', updateSize);
  ${domMutationObserveScript}
  ${setViewportContent(viewportContent)}
  ${scrollEnabledWithZoomedin ? detectZoomChanged : ""}
  updateSize();
  ${longPress};
  `;

const appendFilesToHead = ({ files, script }) =>
  files.reduceRight((combinedScript, file) => {
    const { rel, type, href } = file;
    return `
      var link  = document.createElement('link');
      link.rel  = '${rel}';
      link.type = '${type}';
      link.href = '${href}';
      document.head.appendChild(link);
      ${combinedScript}
    `;
  }, script);

const screenWidth = Dimensions.get("window").width;

const bodyStyle = `
  body {
    margin: 0;
    padding: 0;
  }
`;

const appendStylesToHead = ({ style, script }) => {
  const currentStyles = style ? bodyStyle + style : bodyStyle;
  // Escape any single quotes or newlines in the CSS with .replace()
  const escaped = currentStyles.replace(/\'/g, "\\'").replace(/\n/g, "\\n");
  return `
    var styleElement = document.createElement('style');
    styleElement.innerHTML = '${escaped}';
    document.head.appendChild(styleElement);
    ${script}
  `;
};

const getInjectedSource = ({ html, script }) => `
  ${html}
  <script>
  // prevents code colissions with global scope
  (function() {
    ${script}
  })();
  </script>
`;

const getScript = ({
  files,
  customStyle,
  customScript,
  style,
  viewportContent,
  scalesPageToFit,
  scrollEnabledWithZoomedin,
}) => {
  let script = getBaseScript({
    viewportContent,
    scalesPageToFit,
    scrollEnabledWithZoomedin,
  });
  script =
    files && files.length > 0 ? appendFilesToHead({ files, script }) : script;
  script = appendStylesToHead({ style: customStyle, script });
  customScript && (script = customScript + script);
  return script;
};

export const getWidth = (style) => {
  return style && style.width ? style.width : screenWidth;
};

export const isSizeChanged = ({
  height,
  previousHeight,
  width,
  previousWidth,
}) => {
  if (!height || !width) {
    return;
  }
  return height !== previousHeight || width !== previousWidth;
};

export const reduceData = (props) => {
  const { source } = props;
  const script = getScript(props);
  const { html, baseUrl } = source;
  if (html) {
    return {
      currentSource: { baseUrl, html: getInjectedSource({ html, script }) },
    };
  } else {
    return {
      currentSource: source,
      script,
    };
  }
};

export const shouldUpdate = ({ prevProps, nextProps }) => {
  if (!(prevProps && nextProps)) {
    return true;
  }
  for (const prop in nextProps) {
    if (nextProps[prop] !== prevProps[prop]) {
      if (
        typeof nextProps[prop] === "object" &&
        typeof prevProps[prop] === "object"
      ) {
        if (
          shouldUpdate({
            prevProps: prevProps[prop],
            nextProps: nextProps[prop],
          })
        ) {
          return true;
        }
      } else {
        return true;
      }
    }
  }
  return false;
};
