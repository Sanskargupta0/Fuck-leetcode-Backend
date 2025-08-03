import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import LeetcodeService from '../../services/leetcode.service.js';

const router = express.Router();

router.post('/sync-problems', authMiddleware, async (req, res) => {
    try {
        // Start the problem synchronization process
        const result = await LeetcodeService.syncProblems();
        
        res.status(200).json({
            success: true,
            message: 'Problem synchronization completed successfully.',
            data: result
        });
    } catch (error) {
        console.error('Error syncing problems:', error);
        res.status(500).json({
            success: false,
            message: 'Problem synchronization failed.',
            error: error.message
        });
    }
});

export default router;
