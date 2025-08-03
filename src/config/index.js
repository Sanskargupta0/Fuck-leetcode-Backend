import dotenv from 'dotenv';
dotenv.config();

const config = {
    // Server Configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fuck-leetcode',
    
    // // JWT Configuration
    // JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    // JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    // Admin Configuration
    ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || 'your-admin-secret-key-here',

    // Google Sheets Configuration
    GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID || '',
    GOOGLE_SHEET_RANGE: process.env.GOOGLE_SHEET_RANGE || 'Emails!A:B',
    GOOGLE_COUNT_RANGE: process.env.GOOGLE_COUNT_RANGE || 'Emails!C2',
    GOOGLE_SERVICE_ACCOUNT_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '',

    // // API Keys
    // GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    
    // CORS Configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:8080',
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    
    // // LeetCode API Configuration
    // LEETCODE_RATE_LIMIT_DELAY: parseInt(process.env.LEETCODE_RATE_LIMIT_DELAY) || 1000, // 1 second

    
    
    // // Security
    // BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    
    // API Version
    API_VERSION: process.env.API_VERSION || 'v1'
};

// Validate required environment variables
//const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const requiredEnvVars = ['MONGODB_URI'];

if (config.NODE_ENV === 'production') {
    // Only require GOOGLE_SERVICE_ACCOUNT_KEY in production if Google Sheets features are needed
    if (config.GOOGLE_SPREADSHEET_ID) {
        requiredEnvVars.push('GOOGLE_SERVICE_ACCOUNT_KEY');
    }
}

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    if (config.NODE_ENV === 'production') {
        console.warn('Some features may not work properly without all environment variables');
        // Don't exit in production, let the app start but warn about missing features
    }
}

export default config;
