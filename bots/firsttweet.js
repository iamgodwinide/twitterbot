const puppeteer = require('puppeteer');
const Tweet = require('../model/Tweet');
const Bot = require('../model/Bot');
const likeTweets = require('./likeTweets');

const getFirstTweets = async (usernames, botId) => {
    // Launch Puppeteer and create a new page
    console.log("Gathering Tweets..........");
    let tweets = [];
    const browser = await puppeteer.launch({
        headless: "new"
    });
    const page = await browser.newPage();
    await page.exposeFunction('getGlobalVariables', () => {
        // Return the desired global variables
        return {
            botId
        };
    });

    const getTweet = async index => {
        await page.goto(`https://twitter.com/${usernames[index]}`);
        // Execute a script in the console
        const script = () => {
            const globals = getGlobalVariables();
            const tweets = document.querySelectorAll(".r-kzbkwu");
            let targetHref;

            if (tweets.length > 0) {
                targetHref = document.querySelectorAll(".r-kzbkwu")[0].querySelectorAll("a")[2].href
            }
            const litems = targetHref.split("/");
            return ({
                tweetId: litems[litems.length - 1],
            })
        };
        // Evaluate the script in the page's context
        setTimeout(async () => {
            const result = await page.evaluate(script);
            tweets.push({ ...result, botId });
            if (index < (usernames.length - 1)) {
                getTweet(index + 1);
            } else {
                console.log(tweets);
                // Close the browser
                await browser.close();
                // save tweets to database
                await Tweet.insertMany(tweets);
                // update bot state
                await Bot.updateOne({ botId }, { stage: 3 });
                // like tweets
                likeTweets(botId);
            }
        }, 5000)
    }

    getTweet(0);

};


module.exports = getFirstTweets