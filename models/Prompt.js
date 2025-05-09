const mongoose = require('mongoose');

const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
}

const PROMPT_TYPE = {
    ROLE: 'role',
    SYSTEM: 'system',
    TEMPLATE: 'template',
    APP: 'app'
}

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    key: { type: String, default: '' }, // optional: only used for system prompt
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: [PROMPT_TYPE.ROLE, PROMPT_TYPE.SYSTEM, PROMPT_TYPE.TEMPLATE, PROMPT_TYPE.APP],
        default: PROMPT_TYPE.ROLE
    },
    referenceType: {
        type: String,
        enum: ['', 'role', 'function', 'app'],
        default: ''
    },
    referenceId: { type: String, default: '' },
    isPublic: { type: Boolean, default: false },
    status: {
        type: String,
        enum: [STATUS.ACTIVE, STATUS.INACTIVE],
        default: STATUS.ACTIVE
    }

}, { timestamps: true });

schema.index({ status: 1 });
schema.index({ type: 1 });
schema.index({ referenceId: 1 });

schema.statics.STATUS = STATUS;
schema.statics.PROMPT_TYPE = PROMPT_TYPE;
module.exports = mongoose.model('Prompt', schema);