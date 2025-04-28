const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'affiliatehub-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
          let metaStr = '';
          if (Object.keys(metadata).length > 0 && metadata.service) {
            metaStr = JSON.stringify(metadata);
          }
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      )
    })
  ]
});

module.exports = logger;