import googleSheetsService from '../../services/googleSheets.service.js';
import logger from '../../utils/logger.js';
import { AppError } from '../../utils/errorHandler.js';

/**
 * Get waitlist count
 * @route GET /api/v1/waitlist/count
 * @access Public
 */
export const getWaitlistCount = async (req, res, next) => {
    try {
        // Check if Google Sheets service is initialized
        if (!googleSheetsService.isInitialized) {
            return next(new AppError('Google Sheets service not initialized', 500));
        }
        
        const count = await googleSheetsService.getWaitlistCount();
        
        res.status(200).json({
            success: true,
            data: {
                count
            },
            message: 'Waitlist count retrieved successfully'
        });
    } catch (error) {
        logger.error('Error fetching waitlist count:', error);
        
        if (error.message.includes('Missing Google authentication')) {
            return next(new AppError('Google Sheets service not configured properly', 500));
        }
        
        if (error.message.includes('Spreadsheet not found')) {
            return next(new AppError('Waitlist spreadsheet not found', 404));
        }
        
        return next(new AppError('Failed to fetch waitlist count', 500));
    }
};

/**
 * Add email to waitlist
 * @route POST /api/v1/waitlist/add
 * @access Public
 */
export const addEmailToWaitlist = async (req, res, next) => {
    try {
        // Check if Google Sheets service is initialized
        if (!googleSheetsService.isInitialized) {
            return next(new AppError('Google Sheets service not initialized', 500));
        }
        
        const { email } = req.body;
        
        // Validate email format
        if (!email) {
            return next(new AppError('Email is required', 400));
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new AppError('Please provide a valid email address', 400));
        }
        
        // Add email to waitlist
        const result = await googleSheetsService.addEmailToWaitlist(email.toLowerCase().trim());
        
        res.status(201).json({
            success: true,
            data: {
                email: result.email,
                addedAt: result.timestamp
            },
            message: 'Email added to waitlist successfully'
        });
    } catch (error) {
        logger.error('Error adding email to waitlist:', error);
        
        if (error.message === 'Email already registered') {
            return next(new AppError('This email is already registered in the waitlist', 409));
        }
        
        if (error.message === 'Valid email is required') {
            return next(new AppError('Please provide a valid email address', 400));
        }
        
        if (error.message.includes('Missing Google authentication')) {
            return next(new AppError('Google Sheets service not configured properly', 500));
        }
        
        return next(new AppError('Failed to add email to waitlist', 500));
    }
};
