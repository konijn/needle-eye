function log(priority, message) {
    if (typeof message === 'undefined') {
        message = priority;
        priority = log.DEFAULT;
    }

    if (priority >= LOG_LEVEL) {
        console.log(message);
    }
}

log.LOW = 0;
log.HIGH = 8;
log.DEFAULT = 4;
const LOG_LEVEL = log.DEFAULT ; // Global constant for log level

/* Example usage: */
log(0, 'This is a low priority message');
log(4, 'This is a medium priority message');
log(8, 'This is a high priority message');
log('This is a default priority message');
