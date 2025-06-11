const crypto = require('crypto');

// Sanitize user data before sending to client
const sanitizeUser = (user) => {
    if (!user) return null;
    
    const sanitized = { ...user };
    // Remove sensitive data
    delete sanitized.password;
    delete sanitized.verification_token;
    delete sanitized.reset_token;
    delete sanitized.last_login_ip;
    
    return sanitized;
};

// Generate secure random token
const generateSecureToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

// Validate password strength
const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validate email format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Generate CSRF token
const generateCSRFToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash sensitive data
const hashSensitiveData = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

// Validate username format
const validateUsername = (username) => {
    const minLength = 3;
    const maxLength = 30;
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;

    const errors = [];
    if (username.length < minLength || username.length > maxLength) {
        errors.push(`Username must be between ${minLength} and ${maxLength} characters`);
    }
    if (!usernameRegex.test(username)) {
        errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Rate limiting helper
const isRateLimited = (attempts, maxAttempts, timeWindow) => {
    if (attempts >= maxAttempts) {
        return true;
    }
    return false;
};

// Input sanitization
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove on* attributes
        .trim();
};

module.exports = {
    sanitizeUser,
    generateSecureToken,
    validatePasswordStrength,
    validateEmail,
    generateCSRFToken,
    hashSensitiveData,
    validateUsername,
    isRateLimited,
    sanitizeInput
}; 