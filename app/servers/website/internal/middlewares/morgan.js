const morgan = require('morgan');
const split = require('split');
const logger = require('../../../../libs/logger').createLogger('website');
const expressExtend = require('../libs/utils/expressExtends');

const stream = split().on('data', function (line) {
    let log = logger.info;
    try {
        const status = +line.substring(0, line.indexOf(' '));
        if (status >= 300 && status < 500) {
            log = logger.warn;
        } else if (status >= 500) {
            log = logger.error;
        }
    } catch (e) {
        logger.error('morgan stream error', e);
    }
    log(line);
});

const skip = (req) => {
    if (req.route?.path === '/health' || req.route?.path === '/default' || req.route?.path === '/version') {
        return true;
    }
};

morgan.token('username', function (req) {
    if (!req?.session?.user) {
        return 'system';
    } else {
        return `${req.session.user.id}:${req.session.user.name}`;
    }
});

morgan.token('ip', (req) => {
    return expressExtend.getIp(req) ?? req.ip;
});

morgan.token('uuid', (req) => {
    return req.uuid;
});

morgan.token('body', (req) => {
    let r;
    try {
        r = JSON.stringify(req.body);
    } catch (error) {
        r = req.body;
    }
    return r;
});

module.exports = morgan(
    ':uuid | :status :method :url :body | :response-time ms [:username] [:ip]',
    { stream, skip }
);
