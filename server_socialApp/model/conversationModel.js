const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    text: String,
    media: Array,
    call: Object,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('conversation', conversationSchema)