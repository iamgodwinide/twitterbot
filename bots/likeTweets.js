const { twitterClient } = require("../config/twitterClient.js");
const Bot = require("../model/Bot.js");
const Tweet = require("../model/Tweet.js");

const likeTweets = async (botId) => {
    try {
        console.log("Liking Tweets..........");
        const userID = process.env.MYID;
        let tweets = await Tweet.find({ botId, liked: false });
        const likeFunc = async index => {
            const { tweetId } = tweets[index];
            const isliked = await twitterClient.v2.like(userID, tweetId);
            console.log(isliked);
            if (isliked.data.liked) {
                await Tweet.updateOne({ tweetId }, { liked: true });
            }
            if (isliked.errors) {
                console.log(isliked.errors);
            }
            if (index < (tweets.length - 1)) {
                likeFunc(index + 1);
            }
            else {
                // finish and update bot
                await Bot.updateOne({ botId }, {
                    stage: 4,
                    isFinished: true
                });
                console.log("Completed........")
            }
        };
        likeFunc(0)
    } catch (e) {
        console.log(e)
    }
}

module.exports = likeTweets