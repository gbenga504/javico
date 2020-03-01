/**
 * @module
 * @description This worker thread helps with running the Js source code.
 * We run the source code using the eval method exposed by Js, however this is done in a safe environment i.e the worker since using eval in the browser environment causes some known security issues
 *
 * We also polyfill the console methods. In this worker thread, using the console methods dispatches messages back to the UI.
 * The type of message sent depends on the method used i.e log, error and warn
 */
const worker = self;
const MessageType = {
  ERROR: `error`,
  LOG: `log`,
  WARN: `warn`,
  INFO: `info`,
  DEBUG: `debug`,
  TABLE: `table`,
  TIME: `time`,
  ASSERT: `assert`,
  COUNT: `count`,
};

const console = {
  log: function() {
    worker.postMessage({
      method: MessageType.LOG,
      data: [...arguments],
    });
  },
  error: function() {
    worker.postMessage({
      method: MessageType.ERROR,
      data: [...arguments],
    });
  },
  warn: function() {
    worker.postMessage({
      method: MessageType.WARN,
      data: [...arguments],
    });
  },
  info: function() {
    worker.postMessage({
      method: MessageType.INFO,
      data: [...arguments],
    });
  },
  table: function() {
    worker.postMessage({
      method: MessageType.TABLE,
      data: [...arguments],
    });
  },
  time: function() {
    worker.postMessage({
      method: MessageType.TIME,
      data: [...arguments],
    });
  },
  assert: function() {
    worker.postMessage({
      method: MessageType.ASSERT,
      data: [...arguments],
    });
  },
  count: function() {
    worker.postMessage({
      method: MessageType.COUNT,
      data: [...arguments],
    });
  },
};

worker.addEventListener('message', function(e) {
  let sourceCode = e.data.sourceCode;
  try {
    eval(sourceCode);
  } catch (error) {
    worker.postMessage({ method: MessageType.ERROR, data: [error.stack] });
  }
});
