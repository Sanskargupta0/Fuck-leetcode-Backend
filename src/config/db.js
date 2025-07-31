const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URI);

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('Database connection error:', error);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from MongoDB');
});

// Handle app termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        logger.info('Mongoose connection closed due to app termination');
        process.exit(0);
    } catch (error) {
        logger.error('Error closing mongoose connection:', error);
        process.exit(1);
    }
});

module.exports = connectDB;
