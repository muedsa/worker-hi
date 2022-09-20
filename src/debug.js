import { v4 as uuidV4 } from 'uuid';

export function initDebug(event) {
  event.__debug_log = new DebugLog();
  fetchEventDebug(event);
}

function fetchEventDebug(event){
  if(event.type === 'fetch'){
    event.request.__debug_log = event.__debug_log;
    const { headers } = event.request;
    if(headers.get('debug-secret') === DEBUG_SECRET){
      event.request.__debug_log.debug();
    }
  }
}

export class DebugLog {
  constructor(debugFlag) {
    this.id = uuidV4();
    this.logs = [];
    this.debugFlag = !!debugFlag;
  }

  debug() {
    this.debugFlag = true;
  }

  log(...args) {
    this.logs.push(args);
    console.log(this.id, ...args);
  }

  toString() {
    return 'DEBUG_ID=' + this.id + ' '
      + 'LOGS=' + this.logs.map(logArgs => logArgs.map(arg => arg.toString()).join(',')).join(';');
  }

}
