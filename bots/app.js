const { twitterClient } = require("../config/twitterClient.js");
const Account = require("../model/Account.js");
const Bot = require("../model/Bot.js");
const getFirstTweets = require("./firsttweet.js");
const likeTweets = require("./likeTweets.js");

const getFollowers = async (targetAccountID, targetFollowers, botId, nextToken) => {
    try {
        console.log(`Gathering ${targetFollowers} Followers.......`)
        let followers = [];

        const users = await twitterClient.v2.followers(targetAccountID, {
            max_results: targetFollowers < 1000 ? targetFollowers : 1000,
            asPaginator: true,
            pagination_token: nextToken
        });

        console.log(`You have ${users.rateLimit.remaining} request(s) to pull folowers left`);

        if (users?.data?.data) {
            followers.push(...users.data.data);
            if (users.meta.next_token && followers.length < targetFollowers) {
                getFollowers(targetAccountID, targetFollowers, botId, users.meta.next_token);
            } else {
                // add users to database
                const _accounts = followers.map(acc => ({ ...acc, AID: acc.id, botId }));
                await Account.insertMany(_accounts);

                // change bot state
                await Bot.updateOne({ _id: botId }, { stage: 2 });

                // gather first tweets
                const usernames = followers.map(f => f.username)
                getFirstTweets(usernames, botId);
                setTimeout(() => {
                    likeTweets(botId);
                }, 180000)
            }
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = getFollowers