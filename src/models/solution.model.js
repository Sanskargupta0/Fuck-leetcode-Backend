import mongoose from 'mongoose';

// A list of common languages supported by LeetCode
const supportedLanguages = [
    'javascript', 'python', 'java', 'cpp', 'csharp', 'typescript', 
    'ruby', 'swift', 'golang', 'rust', 'php', 'kotlin'
];

const solutionSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
        unique: true
    },
    languageSolutions: [{
        lang: {
            type: String,
            required: true,
            enum: supportedLanguages 
        },
        typed_code: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});


export default mongoose.model('Solution', solutionSchema);