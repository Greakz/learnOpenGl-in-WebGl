/**
 * since this file is only an example and has no access to any node_modules, it will show some errors...
 */

interface LogEntry {
    type: 'INFO' | 'WARNING' | 'ERROR';
    time: string;
    object: string;
    message: any;
}

// Canvas Storage!
var logs: LogEntry[] = [];
var show_logs_on_income: boolean = false;

// Public methods
export abstract class Log {

    static show_logs(val: boolean) {
        show_logs_on_income = val;
    }

    static clear() {
        console.clear();
    }

    static info(comp: string, message: any) {
        push({
            type: 'INFO',
            time: getTime(),
            object: comp,
            message: message
        });
    }

    static warning(comp: string, message: any) {
        push({
            type: 'WARNING',
            time: getTime(),
            object: comp,
            message: message
        });
    }

    static error(comp: string, message: any) {
        push({
            type: 'ERROR',
            time: getTime(),
            object: comp,
            message: message
        });
    }

    static printLog(index?: number) {
        if(index === undefined) {
            printLog(logs[logs.length - 1])
        } else {
            if(index < logs.length && index >= 0) {
                printLog(logs[index]);
            } else {
                console.error('[ERROR][LOG]: Tried to print a Message that not exists!');
            }
        }
    }
}

function getTime() {
    let now = new Date();
    let sec: string = now.getSeconds().toString();
    if(sec.toString().length === 1) {
        sec = '0' + sec;
    }
    return now.getMinutes() + ':' + sec;
}

function push(log: LogEntry) {
    logs.push(log);
    if(show_logs_on_income) {
        Log.printLog();
    }
}

function printLog(log: LogEntry) {
    switch (log.type) {
        case 'INFO': {
            if(typeof log.message === 'string' || typeof log.message === 'number') {
                console.log(getLogDescriptor(log) + ' ' + log.message);
            }else {
                console.log(getLogDescriptor(log));
                console.log(log.message);
            }
            break;
        }
        case 'WARNING': {
            if(typeof log.message === 'string' || typeof log.message === 'number') {
                console.warn(getLogDescriptor(log) + ' ' + log.message);
            }else {
                console.warn(getLogDescriptor(log));
                console.warn(log.message);
            }
            break;
        }
        case 'ERROR': {
            if(typeof log.message === 'string' || typeof log.message === 'number') {
                console.error(getLogDescriptor(log) + ' ' + log.message);
            }else {
                console.error(getLogDescriptor(log));
                console.error(log.message);
            }
            break;
        }
    }
}
function getLogDescriptor(log: LogEntry) {
    return '[' + log.time + '][' + log.type + '][' + log.object + ']:'
}