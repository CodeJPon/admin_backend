const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const envConfig = require('../configs/envConfig');
const getNamespace = require('continuation-local-storage').getNamespace;
const { combine, timestamp, json, printf, colorize, errors } = format;

const levels = {
  error: 0,
  info: 1,
  http: 2,
  sql: 3,
  warn: 4,
  debug: 5,
};

const colors = {
  error: 'red',
  info: 'green',
  http: 'magenta',
  sql: 'cyan',
  warn: 'yellow',
  debug: 'cyan',
};

winston.addColors(colors);

const level = () => {
  const env = envConfig.env ?? 'dev';
  return ['dev', 'qa', 'sit'].indexOf(env.toLowerCase()) > -1 ? 'debug' : 'http';
};

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let reqId;
  if (level.indexOf('sql') > -1) {
      message = `\x1b[31m${message}\x1b[0m`;
  } else {
      // async method 会抓不到该 reqId
      const namespace = getNamespace('dashboard.platform');
      reqId = namespace && namespace.get('reqId') ? namespace.get('reqId') : '';
  }
  return `${timestamp} ${level}${reqId ? ' ' + reqId : ''} : ${typeof message === 'object' && message !== null ? JSON.stringify(message, null, 4) : message}\n ` + `${metadata.stack || ''}`;
});

const loggers = [];
module.exports.createLogger = function (serviceName) {
  if (loggers[serviceName]) {
      return loggers[serviceName];
  }
  let logsFolder = path.join(path.resolve(), 'logs/');
  if (serviceName && serviceName.trim() !== '') {
      logsFolder = path.join(logsFolder, serviceName, '/');
  }
  if (!fs.existsSync(logsFolder)) {
      fs.mkdirSync(logsFolder, { recursive: true });
  }

  // version Format
  const version = winston.format((info) => {
      if (global.version) {
          info.version = global.version;
      }
      return info;
  });

  const logger = createLogger({
      level: level(),
      levels,
      format: combine(
          timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
          }),
          version(),
          errors({ stack: true }),
          json()
      ),
      defaultMeta: {
          team: 'p',
          service: `dashboard.${serviceName}`,
          brand: envConfig.platform.agentType,
          env: envConfig.env
      },
      // 設定此 logger 的日誌輸出器
      transports: [
          new transports.Console({
              level: level(),
              format: combine(colorize(), logFormat)
          }),
          new transports.DailyRotateFile({
              filename: `${logsFolder}%DATE%.log`,
              json: true,
              datePattern: 'YYYYMMDD'
          })
      ]
  });
  loggers[serviceName] = logger;
  return logger;
};