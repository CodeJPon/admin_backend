const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const envConfig = require('../configs/envConfig');