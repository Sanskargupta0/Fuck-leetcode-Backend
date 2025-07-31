// const mongoose = require('mongoose');

// const solutionSchema = new mongoose.Schema({
//     problemId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Problem',
//         required: true
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     code: {
//         type: String,
//         required: true
//     },
//     language: {
//         type: String,
//         required: true,
//         enum: ['JavaScript', 'Python', 'Java', 'C++', 'C', 'C#', 'Go', 'Ruby', 'Swift', 'Kotlin', 'Rust', 'TypeScript']
//     },
//     explanation: {
//         type: String,
//         trim: true
//     },
//     timeComplexity: {
//         type: String,
//         trim: true
//     },
//     spaceComplexity: {
//         type: String,
//         trim: true
//     },
//     approach: {
//         type: String,
//         trim: true
//     },
//     keyInsights: [String],
//     runtime: {
//         type: Number // in milliseconds
//     },
//     memory: {
//         type: Number // in MB
//     },
//     isOptimal: {
//         type: Boolean,
//         default: false
//     },
//     tags: [{
//         type: String,
//         trim: true
//     }],
//     notes: {
//         type: String,
//         trim: true
//     },
//     difficulty: {
//         type: String,
//         enum: ['Easy', 'Medium', 'Hard']
//     },
//     status: {
//         type: String,
//         enum: ['Draft', 'Published', 'Archived'],
//         default: 'Draft'
//     }
// }, {
//     timestamps: true
// });

// // Compound indexes for efficient queries
// solutionSchema.index({ problemId: 1, userId: 1 });
// solutionSchema.index({ userId: 1, createdAt: -1 });
// solutionSchema.index({ language: 1 });
// solutionSchema.index({ difficulty: 1 });

// module.exports = mongoose.model('Solution', solutionSchema);
