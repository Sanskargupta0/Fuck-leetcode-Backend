// const leetcodeService = require('../services/leetcode.service');
// const geminiService = require('../services/gemini.service');
// const logger = require('../utils/logger');

// class TaskController {
//     async getAllTasks(req, res) {
//         try {
//             // Get all tasks for the user
//             const tasks = await leetcodeService.getUserTasks(req.user.id);
//             res.status(200).json({ success: true, data: tasks });
//         } catch (error) {
//             logger.error('Error getting tasks:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }

//     async getTaskById(req, res) {
//         try {
//             const { id } = req.params;
//             const task = await leetcodeService.getTaskById(id);
            
//             if (!task) {
//                 return res.status(404).json({ success: false, message: 'Task not found' });
//             }
            
//             res.status(200).json({ success: true, data: task });
//         } catch (error) {
//             logger.error('Error getting task:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }

//     async createTask(req, res) {
//         try {
//             const taskData = req.body;
//             const task = await leetcodeService.createTask({ ...taskData, userId: req.user.id });
//             res.status(201).json({ success: true, data: task });
//         } catch (error) {
//             logger.error('Error creating task:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }

//     async updateTask(req, res) {
//         try {
//             const { id } = req.params;
//             const updateData = req.body;
//             const task = await leetcodeService.updateTask(id, updateData);
            
//             if (!task) {
//                 return res.status(404).json({ success: false, message: 'Task not found' });
//             }
            
//             res.status(200).json({ success: true, data: task });
//         } catch (error) {
//             logger.error('Error updating task:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }

//     async deleteTask(req, res) {
//         try {
//             const { id } = req.params;
//             await leetcodeService.deleteTask(id);
//             res.status(200).json({ success: true, message: 'Task deleted successfully' });
//         } catch (error) {
//             logger.error('Error deleting task:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }
// }

// module.exports = new TaskController();
