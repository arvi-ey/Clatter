const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    reactions: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'user' },
            reaction: String
        }
    ],
    attachments: [
        {
            type: {
                type: String,
                enum: ['image', 'video', 'file'],
                required: true
            },
            url: String,
            thumbnail: String
        }
    ]
});

module.exports = mongoose.model('Message', messageSchema);
