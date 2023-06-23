const { model, Schema } = require("mongoose");

const TweetSchema = new Schema({
    tweetId: {
        type: String,
        required: true
    },
    botId: {
        type: String,
        required: true
    },
    liked: {
        type: Boolean,
        required: false,
        default: false
    },

});

module.exports = Tweet = model("Tweet", TweetSchema);