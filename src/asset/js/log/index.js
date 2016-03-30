console.info = console.info || console.log;
console.warn = console.warn || console.log;
console.error = console.error || console.log;
console.trace = console.trace || console.log;

let log = {
  info: (msg) => {
    console.info(`${new Date().toLocaleString()} ${msg}`);
  },
  error: (err) => {
    console.error(`${new Date().toLocaleString()}`, err);
  },
  success: (msg) => {
    console.info(`${new Date().toLocaleString()} ${msg}`);
  },
  warn: (msg) => {
    console.warn(`${new Date().toLocaleString()} ${msg}`);
  },
  trace: (msg) => {
    console.trace(`${new Date().toLocaleString()} ${msg}`);
  }
}

export default log;
