const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    question_id: {
        type: Number,
        required: true,
        unique: true
    },
    question__title: {
        type: String,
        required: true,
        trim: true
    },
    question__title_slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    difficulty: {
        type: Number,
        required: true,
        enum: [1, 2, 3]
    },
    question__hide: {
        type: Boolean,
        default: false
    },
    paid_only:{
        type: Boolean,
        default: false
    }
    
}, {
    timestamps: true
});

// Indexes for faster queries
problemSchema.index({ difficulty: 1 });
problemSchema.index({ question_id: 1 });
problemSchema.index({ question__title_slug: 1 });

module.exports = mongoose.model('Problem', problemSchema);
