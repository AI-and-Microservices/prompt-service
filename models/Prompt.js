const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    content: {type: String, default: ''},
    isPublic: { type: Boolean, default: false },
    type: { 
        type: String, 
        enum: ['role', 'system'], 
        default: 'role' 
    },
    referenceId: {type: String, default: ''},
}, { timestamps: true });

schema.index({ name: 'text'});

module.exports = mongoose.model('Prompt', schema);