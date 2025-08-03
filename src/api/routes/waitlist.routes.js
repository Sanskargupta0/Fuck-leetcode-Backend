import express from 'express';
import * as waitlistController from '../controllers/waitlist.controller.js';

const router = express.Router();

/**
 * @route GET /api/v1/waitlist/count
 * @desc Get waitlist count
 * @access Public
 */
router.get('/count', waitlistController.getWaitlistCount);

/**
 * @route POST /api/v1/waitlist/add
 * @desc Add email to waitlist
 * @access Public
 */
router.post('/add', waitlistController.addEmailToWaitlist);


export default router;
