import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import axios from 'axios';
import Problem from '../models/problem.model.js';

const MONGODB_URI = process.env.MONGODB_URI;
const LEETCODE_API_URL = 'https://leetcode.com/api/problems/all/';

/**
 * Connects to MongoDB, fetches problem data from LeetCode API,
 * and performs a bulk upsert operation to populate the database.
 */
const populateDatabase = async () => {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in your .env file.');
    process.exit(1);
  }

  try {
    // 1. Connect to the database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection established.');

    // 2. Fetch data from LeetCode API
    console.log('Fetching data from LeetCode API...');
    const response = await axios.get(LEETCODE_API_URL);
    const problems = response.data?.stat_status_pairs;

    if (!problems || problems.length === 0) {
      throw new Error('Could not fetch problems or the list is empty.');
    }
    console.log(`Found ${problems.length} problems to process.`);

    // 3. Prepare bulk operations
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

    // 4. Execute the bulk write operation
    console.log('Starting database population...');
    const result = await Problem.bulkWrite(bulkOps);
    console.log('Database population complete!');
    console.log(`- New problems added: ${result.upsertedCount}`);
    console.log(`- Existing problems updated: ${result.modifiedCount}`);

  } catch (error) {
    console.error('❌ An error occurred:', error.message);
  } finally {
    // 5. Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

// Run the script
populateDatabase();