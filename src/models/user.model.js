const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    leetcodeUsername: {
        type: String,
        trim: true
    },
    solvedProblems: [{
        problemId: {
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
    preferences: {
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Easy'
        },
        topics: [{
            type: String
        }]
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
