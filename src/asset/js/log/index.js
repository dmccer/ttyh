console.info = console.info || console.log;
console.warn = console.warn || console.log;
console.error = console.error || console.log;
console.trace = console.trace || console.log;

let log = {
  info: (msg) => {
    console.info(`${new Date().toLocaleString()} ${msg}`);
  },
  error: (err) => {
    console.error(`${new Date().toLocaleString()} - 错误日志 start`);
    console.error(err);
    console.error(`-- 错误日志 end --`);
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
