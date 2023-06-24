const { twitterClient } = require("../config/twitterClient.js");
const Bot = require("../model/Bot.js");
const Tweet = require("../model/Tweet.js");

const likeTweets = async (botId) => {
    try {
        let limitCount = 0;
        console.log("Liking Tweets..........");
        const userID = process.env.MYID;

        const likeFunc = async index => {

            if (limitCount === 5) {
                console.log("I have reached my limit...trying again after 15 minutes");
                setTimeout(() => {
                    limitCount = 0;
                    console.log("Alright let's continue.....")
                    likeFunc(index);
                }, 960000);
            } else {
                let tweets = await Tweet.find({ botId, liked: false });
                let totalTweets = await Tweet.find({ botId });
                const { tweetId } = tweets[index];
                const isliked = await twitterClient.v2.like(userID, tweetId);
                console.log(`Liked: ${tweetId} ........ ${(totalTweets.length - tweets.length) + 1}/${totalTweets.length}`);

                if (isliked.data.liked) {
                    limitCount += 1;
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
                    console.log("Actions Completed........")
                }
            }
        };
        likeFunc(0)
    } catch (e) {
        console.log(e)
    }
}

module.exports = likeTweets