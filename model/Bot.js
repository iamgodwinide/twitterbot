const { model, Schema } = require("mongoose");

const BotSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    targetAccountID: {
        type: String,
        required: true
    },
    targetFollowers: {
        type: Number,
        required: true,
        default: 5
    },
    initialized: {
        type: Boolean,
        required: false,
        default: false
    },
    isRunning: {
        type: Boolean,
        default: false
    },
    stage: {
        type: Number,
        default: 1
    }
});

module.exports = Bot = model("Bot", BotSchema);