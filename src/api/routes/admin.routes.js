import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import LeetcodeService from '../../services/leetcode.service.js';

const router = express.Router();

router.post('/sync-problems', authMiddleware, (req, res) => {
    
    // Start the problem synchronization process
    LeetcodeService.syncProblems()

    res.status(202).json({
        message: 'Problem synchronization process started in the background.'
    });
});

export default router;
