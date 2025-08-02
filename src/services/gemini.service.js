// import { GoogleGenerativeAI } from '@google/generative-ai';
// import config from '../config/index.js';
// import logger from '../utils/logger.js';

// class GeminiService {
//     constructor() {
//         this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
//         this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     }

//     async generateSolutionExplanation(problemTitle, problemDescription, solutionCode, language) {
//         try {
//             const prompt = `
//                 Analyze this LeetCode solution and provide a comprehensive explanation:
                
//                 Problem: ${problemTitle}
//                 Description: ${problemDescription}
                
//                 Solution Code (${language}):
//                 ${solutionCode}
                
//                 Please provide:
//                 1. A clear explanation of the approach used
//                 2. Time complexity analysis
//                 3. Space complexity analysis
//                 4. Key insights and intuition
//                 5. Step-by-step walkthrough of the algorithm
//                 6. Any edge cases handled
//                 7. Possible optimizations or alternative approaches
                
//                 Format the response in a structured manner with clear sections.
//             `;

//             const result = await this.model.generateContent(prompt);
//             const response = await result.response;
//             return response.text();
//         } catch (error) {
//             logger.error('Error generating solution explanation:', error);
//             throw error;
//         }
//     }

//     async generateHints(problemTitle, problemDescription, difficulty) {
//         try {
//             const prompt = `
//                 Generate helpful hints for this LeetCode problem without giving away the complete solution:
                
//                 Problem: ${problemTitle}
//                 Difficulty: ${difficulty}
//                 Description: ${problemDescription}
                
//                 Provide 3-5 progressive hints that guide towards the solution:
//                 1. Start with general approach hints
//                 2. Progress to more specific algorithmic hints
//                 3. End with implementation details (without revealing the exact code)
                
//                 Each hint should be on a new line and numbered.
//             `;

//             const result = await this.model.generateContent(prompt);
//             const response = await result.response;
//             return response.text().split('\n').filter(line => line.trim());
//         } catch (error) {
//             logger.error('Error generating hints:', error);
//             throw error;
//         }
//     }

//     async optimizeSolution(solutionCode, language, currentComplexity) {
//         try {
//             const prompt = `
//                 Analyze this solution and suggest optimizations:
                
//                 Current Solution (${language}):
//                 ${solutionCode}
                
//                 Current Complexity: ${currentComplexity}
                
//                 Please provide:
//                 1. Analysis of the current solution's efficiency
//                 2. Potential optimizations
//                 3. Alternative algorithms or data structures
//                 4. Improved code if possible
//                 5. Trade-offs between different approaches
                
//                 Focus on practical improvements that maintain readability.
//             `;

//             const result = await this.model.generateContent(prompt);
//             const response = await result.response;
//             return response.text();
//         } catch (error) {
//             logger.error('Error optimizing solution:', error);
//             throw error;
//         }
//     }

//     async generateTestCases(problemTitle, problemDescription) {
//         try {
//             const prompt = `
//                 Generate comprehensive test cases for this LeetCode problem:
                
//                 Problem: ${problemTitle}
//                 Description: ${problemDescription}
                
//                 Please provide:
//                 1. Basic test cases covering normal scenarios
//                 2. Edge cases (empty inputs, single elements, etc.)
//                 3. Corner cases (maximum/minimum constraints)
//                 4. Expected outputs for each test case
                
//                 Format as JSON array with input and expected output for each test case.
//             `;

//             const result = await this.model.generateContent(prompt);
//             const response = await result.response;
            
//             try {
//                 return JSON.parse(response.text());
//             } catch (parseError) {
//                 // If JSON parsing fails, return raw text
//                 return response.text();
//             }
//         } catch (error) {
//             logger.error('Error generating test cases:', error);
//             throw error;
//         }
//     }

//     async explainComplexity(solutionCode, language) {
//         try {
//             const prompt = `
//                 Analyze the time and space complexity of this solution:
                
//                 Code (${language}):
//                 ${solutionCode}
                
//                 Please provide:
//                 1. Detailed time complexity analysis with explanation
//                 2. Detailed space complexity analysis with explanation
//                 3. Best, average, and worst case scenarios if applicable
//                 4. Explanation of how you arrived at these complexities
                
//                 Use Big O notation and explain your reasoning clearly.
//             `;

//             const result = await this.model.generateContent(prompt);
//             const response = await result.response;
//             return response.text();
//         } catch (error) {
//             logger.error('Error explaining complexity:', error);
//             throw error;
//         }
//     }

//     async generateAlternativeApproaches(problemTitle, problemDescription, currentApproach) {
//         try {
//             const prompt = `
//                 Suggest alternative approaches for this LeetCode problem:
                
//                 Problem: ${problemTitle}
//                 Description: ${problemDescription}
//                 Current Approach: ${currentApproach}
                
//                 Please suggest 2-3 different approaches with:
//                 1. Brief description of each approach
//                 2. Time and space complexity
//                 3. Pros and cons of each approach
//                 4. When to use each approach
                
//                 Focus on significantly different algorithmic approaches.
//             `;

//             const result = await this.model.generateContent(prompt);
//             const response = await result.response;
//             return response.text();
//         } catch (error) {
//             logger.error('Error generating alternative approaches:', error);
//             throw error;
//         }
//     }
// }

// export default new GeminiService();
