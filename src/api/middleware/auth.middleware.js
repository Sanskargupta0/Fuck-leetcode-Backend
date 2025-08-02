import config from '../../config/index.js';
import logger from '../../utils/logger.js';

const authMiddleware = async (req, res, next) => {
    try {
           const secret  =  req.header('x-secret-key');
        if (secret !== config.ADMIN_SECRET_KEY) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to access this resource.'
            });
        } else {
            next();
        }
    } catch (error) {
        logger.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export default authMiddleware;
