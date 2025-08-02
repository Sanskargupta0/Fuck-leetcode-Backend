import express from 'express';
import * as taskController from '../controllers/task.controller.js';

const router = express.Router();

router.get('/', taskController.getNextTask);

router.post('/result', taskController.reportTaskResult);

export default router;
