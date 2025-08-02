import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    leetcodeUsername: {
        type: String,
        trim: true
    },
    solvedProblems: [{
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem'
        },
        solutionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Solution'
        },
        solvedAt: {
            type: Date,
            default: Date.now
        }
    }],
    apiKey: {
        type: String,
        unique: true,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

// Compound indexes for faster queries
userSchema.index({ apiKey: 1, solvedProblems: 1 });

export default mongoose.model('User', userSchema);
