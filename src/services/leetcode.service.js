// const axios = require('axios');
// const Problem = require('../models/problem.model');
// const Solution = require('../models/solution.model');
// const logger = require('../utils/logger');

// class LeetcodeService {
//     constructor() {
//         this.baseURL = 'https://leetcode.com/api';
//         this.graphqlURL = 'https://leetcode.com/graphql';
//     }

//     async fetchProblemBySlug(slug) {
//         try {
//             const query = `
//                 query getProblem($titleSlug: String!) {
//                     question(titleSlug: $titleSlug) {
//                         questionId
//                         title
//                         titleSlug
//                         content
//                         difficulty
//                         topicTags {
//                             name
//                         }
//                         hints
//                         similarQuestions
//                         exampleTestcases
//                         constraints
//                         companyTagStats
//                         stats
//                     }
//                 }
//             `;

//             const response = await axios.post(this.graphqlURL, {
//                 query,
//                 variables: { titleSlug: slug }
//             });

//             return response.data.data.question;
//         } catch (error) {
//             logger.error('Error fetching problem from LeetCode:', error);
//             throw error;
//         }
//     }

//     async syncProblem(slug) {
//         try {
//             const leetcodeProblem = await this.fetchProblemBySlug(slug);
            
//             if (!leetcodeProblem) {
//                 throw new Error('Problem not found on LeetCode');
//             }

//             // Check if problem already exists
//             let problem = await Problem.findOne({ slug: leetcodeProblem.titleSlug });
            
//             const problemData = {
//                 leetcodeId: parseInt(leetcodeProblem.questionId),
//                 title: leetcodeProblem.title,
//                 slug: leetcodeProblem.titleSlug,
//                 difficulty: leetcodeProblem.difficulty,
//                 description: leetcodeProblem.content,
//                 topics: leetcodeProblem.topicTags.map(tag => tag.name),
//                 hints: leetcodeProblem.hints || [],
//                 constraints: leetcodeProblem.constraints ? leetcodeProblem.constraints.split('\n') : [],
//                 stats: JSON.parse(leetcodeProblem.stats || '{}')
//             };

//             if (problem) {
//                 // Update existing problem
//                 problem = await Problem.findByIdAndUpdate(problem._id, problemData, { new: true });
//             } else {
//                 // Create new problem
//                 problem = new Problem(problemData);
//                 await problem.save();
//             }

//             return problem;
//         } catch (error) {
//             logger.error('Error syncing problem:', error);
//             throw error;
//         }
//     }

//     async getUserTasks(userId) {
//         try {
//             const solutions = await Solution.find({ userId })
//                 .populate('problemId')
//                 .sort({ createdAt: -1 });
            
//             return solutions;
//         } catch (error) {
//             logger.error('Error getting user tasks:', error);
//             throw error;
//         }
//     }

//     async getTaskById(taskId) {
//         try {
//             const solution = await Solution.findById(taskId).populate('problemId');
//             return solution;
//         } catch (error) {
//             logger.error('Error getting task by ID:', error);
//             throw error;
//         }
//     }

//     async createTask(taskData) {
//         try {
//             // If problemSlug is provided, sync the problem first
//             if (taskData.problemSlug) {
//                 const problem = await this.syncProblem(taskData.problemSlug);
//                 taskData.problemId = problem._id;
//             }

//             const solution = new Solution(taskData);
//             await solution.save();
            
//             return await Solution.findById(solution._id).populate('problemId');
//         } catch (error) {
//             logger.error('Error creating task:', error);
//             throw error;
//         }
//     }

//     async updateTask(taskId, updateData) {
//         try {
//             const solution = await Solution.findByIdAndUpdate(
//                 taskId,
//                 updateData,
//                 { new: true, runValidators: true }
//             ).populate('problemId');
            
//             return solution;
//         } catch (error) {
//             logger.error('Error updating task:', error);
//             throw error;
//         }
//     }

//     async deleteTask(taskId) {
//         try {
//             await Solution.findByIdAndDelete(taskId);
//             return true;
//         } catch (error) {
//             logger.error('Error deleting task:', error);
//             throw error;
//         }
//     }

//     async searchProblems(filters = {}) {
//         try {
//             const query = {};
            
//             if (filters.difficulty) {
//                 query.difficulty = filters.difficulty;
//             }
            
//             if (filters.topics && filters.topics.length > 0) {
//                 query.topics = { $in: filters.topics };
//             }
            
//             if (filters.search) {
//                 query.$or = [
//                     { title: { $regex: filters.search, $options: 'i' } },
//                     { description: { $regex: filters.search, $options: 'i' } }
//                 ];
//             }

//             const problems = await Problem.find(query)
//                 .limit(filters.limit || 20)
//                 .skip(filters.offset || 0)
//                 .sort({ leetcodeId: 1 });
            
//             return problems;
//         } catch (error) {
//             logger.error('Error searching problems:', error);
//             throw error;
//         }
//     }
// }

// module.exports = new LeetcodeService();
