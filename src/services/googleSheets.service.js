import { google } from 'googleapis';
import config from '../config/index.js';
import logger from '../utils/logger.js';

class GoogleSheetsService {
    constructor() {
        this.auth = null;
        this.sheets = null;
        this.isInitialized = false;
    }

    /**
     * Initialize Google Sheets authentication
     */
    async initializeAuth() {
        try {
            if (this.isInitialized) {
                return;
            }

            if (!config.GOOGLE_SERVICE_ACCOUNT_KEY) {
                logger.warn('Google Sheets service not configured - GOOGLE_SERVICE_ACCOUNT_KEY missing');
                return;
            }

            if (!config.GOOGLE_SPREADSHEET_ID) {
                logger.warn('Google Sheets service not configured - GOOGLE_SPREADSHEET_ID missing');
                return;
            }

            // Using Service Account (Recommended for production)
            const serviceAccount = JSON.parse(config.GOOGLE_SERVICE_ACCOUNT_KEY);
            this.auth = new google.auth.GoogleAuth({
                credentials: serviceAccount,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
            logger.info('Google Sheets: Service Account authentication initialized');
            
            this.isInitialized = true;
            logger.info('Google Sheets API authentication initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize Google authentication:', error);
            // Don't throw error to prevent app crash if Google Sheets is not critical
            logger.warn('Google Sheets service will be disabled due to configuration error');
        }
    }

    /**
     * Get authenticated Google Sheets instance
     */
    async getAuthenticatedSheets() {
        if (!this.isInitialized) {
            await this.initializeAuth();
        }

        const authClient = await this.auth.getClient();
        return google.sheets({ version: 'v4', auth: authClient });
    }

    /**
     * Get waitlist count from Google Sheets
     */
    async getWaitlistCount() {
        try {
            const sheets = await this.getAuthenticatedSheets();
            
            // Try to get count from a specific cell first (like C2)
            try {
                const countResponse = await sheets.spreadsheets.values.get({
                    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
                    range: config.GOOGLE_COUNT_RANGE,
                });
                
                const countValue = countResponse.data.values?.[0]?.[0];
                if (countValue && !isNaN(parseInt(countValue))) {
                    logger.info(`Waitlist count retrieved from count cell: ${countValue}`);
                    return parseInt(countValue);
                }
            } catch (error) {
                logger.debug('Count cell not found, calculating from data rows');
            }
            
            // Fallback: count rows with data
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
                range: config.GOOGLE_SHEET_RANGE,
            });
            
            const rows = response.data.values || [];
            // Subtract 1 for header row if it exists
            const count = Math.max(0, rows.length - 1);
            
            logger.info(`Waitlist count calculated from rows: ${count}`);
            return count;
        } catch (error) {
            logger.error('Error fetching waitlist count:', error);
            throw error;
        }
    }

    /**
     * Add email to waitlist
     */
    async addEmailToWaitlist(email) {
        try {
            if (!email || !email.includes('@')) {
                throw new Error('Valid email is required');
            }

            const sheets = await this.getAuthenticatedSheets();
            
            // Check if email already exists
            const existingResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
                range: config.GOOGLE_SHEET_RANGE,
            });
            
            const existingRows = existingResponse.data.values || [];
            const emailExists = existingRows.some(row => 
                row[0] && row[0].toLowerCase() === email.toLowerCase()
            );
            
            if (emailExists) {
                logger.warn(`Attempt to add duplicate email: ${email}`);
                throw new Error('Email already registered');
            }
            
            // Add new email
            const newRow = [email, new Date().toISOString()];
            
            await sheets.spreadsheets.values.append({
                spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
                range: config.GOOGLE_SHEET_RANGE,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [newRow],
                },
            });
            
            
            logger.info(`Email added to waitlist: ${email}`);
            return { success: true, email, timestamp: newRow[1] };
        } catch (error) {
            logger.error('Error adding email to waitlist:', error);
            throw error;
        }
    }

    /**
     * Validate Google Sheets configuration
     */
    validateConfiguration() {
        if (!config.GOOGLE_SPREADSHEET_ID) {
            throw new Error('GOOGLE_SPREADSHEET_ID is required');
        }

        const hasServiceAccount = config.GOOGLE_SERVICE_ACCOUNT_KEY;

        if (!hasServiceAccount) {
            throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is required for Google Sheets service');    
        }

       
        return true;
    }
}

export default new GoogleSheetsService();
