const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'user-service' },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Write all logs with level 'error' and below to error.log
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs with level 'info' and below to combined.log
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

// Create a stream object for Morgan
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

// Add security-related logging
const securityLogger = {
    logLoginAttempt: (email, success, ipAddress) => {
        logger.info('Login attempt', {
            email,
            success,
            ipAddress,
            timestamp: new Date().toISOString()
        });
    },

    logPasswordChange: (userId) => {
        logger.info('Password changed', {
            userId,
            timestamp: new Date().toISOString()
        });
    },

    logSensitiveOperation: (operation, userId, details) => {
        logger.warn('Sensitive operation', {
            operation,
            userId,
            details,
            timestamp: new Date().toISOString()
        });
    },

    logSecurityViolation: (violation, details) => {
        logger.error('Security violation', {
            violation,
            details,
            timestamp: new Date().toISOString()
        });
    }
};

// Add audit logging
const auditLogger = {
    logUserAction: (userId, action, details) => {
        logger.info('User action', {
            userId,
            action,
            details,
            timestamp: new Date().toISOString()
        });
    },

    logDataAccess: (userId, resource, action) => {
        logger.info('Data access', {
            userId,
            resource,
            action,
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    logger,
    securityLogger,
    auditLogger
}; 