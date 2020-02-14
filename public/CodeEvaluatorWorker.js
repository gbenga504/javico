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
  WARNING: `warning`,
};
const console = {
  getMessage: function(arg) {
    let str = '';
    for (let i = 0; i < arg.length; i++) {
      str += arg[i];
    }
    return `${str}\n`;
  },
  log: function() {
    worker.postMessage({
      type: MessageType.LOG,
      message: console.getMessage(arguments),
    });
  },
  error: function() {
    worker.postMessage({
      type: MessageType.ERROR,
      message: console.getMessage(arguments),
    });
  },
  warn: function() {
    worker.postMessage({
      type: MessageType.WARNING,
      message: console.getMessage(arguments),
    });
  },
};

worker.addEventListener('message', function(e) {
  let sourceCode = e.data.sourceCode;
  try {
    eval(sourceCode);
  } catch (error) {
    worker.postMessage({ type: MessageType.ERROR, message: error.stack });
  }
});
