import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import compression from 'compression';
import morgan from 'morgan';

// Import configuration and utilities
import config from './src/config/index.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { globalErrorHandler } from './src/utils/errorHandler.js';

// Import routes
// import userRoutes from './src/api/routes/user.routes.js';
import taskRoutes from './src/api/routes/task.routes.js';
import adminRoutes from './src/api/routes/admin.routes.js';

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Trust proxy (important for rate limiting behind proxies like Heroku, Nginx, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet()); // Set various HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL injection attacks
app.use(xss()); // Clean user input from XSS attacks

// Rate limiting
const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { stream: logger.stream }));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
        version: config.API_VERSION
    });
});

// API routes
// app.use(`/api/${config.API_VERSION}/users`, userRoutes);
app.use(`/api/${config.API_VERSION}/tasks`, taskRoutes);
app.use(`/api/${config.API_VERSION}/admin`, adminRoutes);

// Handle undefined routes
app.all('/*splat', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running in ${config.NODE_ENV} mode on port ${PORT}`);
    logger.info(`📚 API Documentation available at http://localhost:${PORT}/api/${config.API_VERSION}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        logger.info('💥 Process terminated!');
    });
});

export default app;
