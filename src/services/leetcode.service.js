import axios from 'axios';
import Problem from '../models/problem.model.js';
import logger from '../utils/logger.js';


class LeetcodeService {
  constructor() {
    this.baseURL = 'https://leetcode.com/api';
    this.graphqlURL = 'https://leetcode.com/graphql';
    this.LEETCODE_API_URL = 'https://leetcode.com/api/problems/all/';
  }

  async syncProblemsWithDB() {
    try {
      // Fetch data from LeetCode API
      console.log('Fetching data from LeetCode API...');
      const response = await axios.get(this.LEETCODE_API_URL);
      const problems = response.data?.stat_status_pairs;

      if (!problems || problems.length === 0) {
        throw new Error('Could not fetch problems or the list is empty.');
      }
      console.log(`Found ${problems.length} problems to process.`);

      // Prepare bulk operations
      const bulkOps = problems.map(problem => ({
        updateOne: {
          filter: { question_id: problem.stat.question_id },
          update: {
            $set: {
              question_id: problem.stat.question_id,
              question__title: problem.stat.question__title,
              question__title_slug: problem.stat.question__title_slug,
              difficulty: problem.difficulty.level,
              question__hide: problem.stat.question__hide,
              paid_only: problem.paid_only,
            },
          },
          upsert: true, // This creates the document if it doesn't exist
        },
      }));

      // Execute the bulk write operation
      console.log('Starting database population...');
      const result = await Problem.bulkWrite(bulkOps);
      console.log('Database population complete!');
      console.log(`- New problems added: ${result.upsertedCount}`);
      console.log(`- Existing problems updated: ${result.modifiedCount}`);

      logger.info(`Database populated: ${result.upsertedCount} new problems, ${result.modifiedCount} updated`);
      return {
        success: true,
        upsertedCount: result.upsertedCount,
        modifiedCount: result.modifiedCount,
        totalProblems: problems.length
      };

    } catch (error) {
      console.error('❌ An error occurred:', error.message);
      logger.error('Error populating database:', error);
      throw error;
    }
  }

}

export default new LeetcodeService();
