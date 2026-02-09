const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,
    },
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);