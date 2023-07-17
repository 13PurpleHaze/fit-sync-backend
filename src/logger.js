import winston from 'winston';
import 'dotenv/config';

const prodLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
          }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({filename: 'logs/logs.json'}),
    ]
})

const devLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console(),
    ],
});

let logger = {};

if(process.env.NODE_ENV === 'development') {
  logger = devLogger;
} else {
  logger = prodLogger;
};

export default logger;