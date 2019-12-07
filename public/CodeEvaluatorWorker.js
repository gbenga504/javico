const worker = self;
const MessageType = {
  ERROR: `error`,
  LOG: `log`,
  WARNING: `warning`
};
const console = {
  getMessage: function(arg) {
    let str = "";
    for (let i = 0; i < arg.length; i++) {
      str += arg[i];
    }
    return `${str}\n`;
  },
  log: function() {
    worker.postMessage({
      type: MessageType.LOG,
      message: console.getMessage(arguments)
    });
  },
  error: function() {
    worker.postMessage({
      type: MessageType.ERROR,
      message: console.getMessage(arguments)
    });
  },
  warning: function() {
    worker.postMessage({
      type: MessageType.WARNING,
      message: console.getMessage(arguments)
    });
  }
};

worker.addEventListener("message", function(e) {
  let code = e.data.code;
  try {
    eval(code);
  } catch (error) {
    worker.postMessage({ type: MessageType.ERROR, message: error });
  }
});
