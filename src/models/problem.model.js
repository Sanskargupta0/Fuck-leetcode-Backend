import mongoose from 'mongoose';

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

// Compound  indexes for faster queries
problemSchema.index({ question_id: 1,   question__title_slug: 1})

export default mongoose.model('Problem', problemSchema);
