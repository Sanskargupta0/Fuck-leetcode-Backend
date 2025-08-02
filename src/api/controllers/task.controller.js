// import leetcodeService from '../services/leetcode.service.js';
// import geminiService from '../services/gemini.service.js';
// import logger from '../utils/logger.js';

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

// export default new TaskController();


import User from '../../models/user.model.js';
import Problem from '../../models/problem.model.js';
import Solution from '../../models/solution.model.js';

/**
 * Determines and returns the next problem for a user to solve.
 * Triggered by: GET /api/task?apiKey=:apiKey
 */
const getNextTask = async (req, res) => {
  try {
    const { apiKey } = req.query;
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required.' });
    }

    // 1. Find the user by their API key
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(404).json({ error: 'User not found for the given API key.' });
    }

    // 2. Find the next unsolved, non-premium problem
    // The logic: find a problem whose ID is not in the user's solved list.
    const nextProblem = await Problem.findOne({
      _id: { $nin: user.solvedProblems.map(p => p.question_id) }, // Find a problem NOT IN the user's solved list
      paid_only: false,
    }).sort({ question_id: 1 }); // Get the one with the lowest ID first

    if (!nextProblem) {
      return res.status(200).json({ message: 'Congratulations! You have solved all available problems.' });
    }
    
    // 3. Find the solution for that problem
    const solutionDoc = await Solution.findOne({ question_id: nextProblem._id });
    if (!solutionDoc || solutionDoc.languageSolutions.length === 0) {
      return res.status(404).json({ error: `No solutions found for problem: ${nextProblem.question__title}` });
    }

    // For now, let's just grab the first available solution.
    // A future improvement would be to match this with the user's language preference.
    const solution = solutionDoc.languageSolutions[0];

    // 4. Send the task to the cron job
    res.status(200).json({
      problemId: nextProblem._id,
      problemTitle: nextProblem.question__title,
      problemSlug: nextProblem.question__title_slug,
      solution: {
        lang: solution.lang,
        typed_code: solution.typed_code,
      },
    });

  } catch (error) {
    console.error('Error in getNextTask:', error);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
};

/**
 * Receives the result of a submission from the cron job and updates the user's data.
 * Triggered by: POST /api/task/result?apiKey=:apiKey
 */
const reportTaskResult = async (req, res) => {
  try {
    const { apiKey } = req.query;
    const { problemId, status } = req.body;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required.' });
    }
    if (!problemId || !status) {
      return res.status(400).json({ error: 'Request body must include problemId and status.' });
    }

    // Find the user
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // If the submission was successful, update the user's solved list
    if (status === 'success') {
      await User.updateOne(
        { _id: user._id },
        {
          // Use $addToSet to prevent adding duplicate problem IDs
          $addToSet: {
            solvedProblems: { question_id: problemId }
          },
        }
      );
      return res.status(200).json({ message: 'User progress updated successfully.' });
    }

    // If status was not 'success', just acknowledge receipt.
    // You could add failure tracking logic here later.
    res.status(200).json({ message: 'Result received.' });

  } catch (error) {
    console.error('Error in reportTaskResult:', error);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
};


export { getNextTask, reportTaskResult };