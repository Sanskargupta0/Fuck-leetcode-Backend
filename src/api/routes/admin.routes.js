// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/auth.middleware');

// // Admin routes
// router.get('/users', authMiddleware, (req, res) => {
//     // Get all users - admin only
//     res.status(200).json({ message: 'Admin users endpoint' });
// });

// router.get('/stats', authMiddleware, (req, res) => {
//     // Get system stats - admin only
//     res.status(200).json({ message: 'Admin stats endpoint' });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const LeetcodeService = require('../../services/leetcode.service');



router.post('/sync-problems', authMiddleware, (req, res) => {
    
    // Start the problem synchronization process
    LeetcodeService.syncProblems()

    res.status(202).json({
        message: 'Problem synchronization process started in the background.'
    });
});

module.exports = router;
