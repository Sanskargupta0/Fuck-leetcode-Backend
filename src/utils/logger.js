import winston from 'winston';
import path from 'path';
import config from '../config/index.js';

// Define custom colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue'
};

winston.addColors(colors);

// Create logs directory if it doesn't exist (only if not in serverless environment)
import fs from 'fs';
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY;

let logsDir;
if (!isServerless) {
    logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level}]: ${stack || message}`;
    })
);

// Create the logger
const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: logFormat,
    defaultMeta: { service: 'fuck-leetcode-backend' },
    transports: [],
});

// Add file transports only if not in serverless environment
if (!isServerless && logsDir) {
    logger.add(new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }));
    
    logger.add(new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }));
}

// Always add console transport
logger.add(new winston.transports.Console({
    format: config.NODE_ENV !== 'production' ? consoleFormat : logFormat
}));

// Create a stream object for Morgan middleware
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

export default logger;
