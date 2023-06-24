const puppeteer = require('puppeteer');
const Tweet = require('../model/Tweet');
const Bot = require('../model/Bot');
const likeTweets = require('./likeTweets');

const getFirstTweets = async (usernames, botId) => {
    // Launch Puppeteer and create a new page
    console.log("Using webscraping to gather tweets..........");
    let tweets = [];
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const getTweet = async index => {
        await page.goto(`http://twitter.com/${usernames[index]}`, {
            timeout: 90000,
            waitUntil: "networkidle0"
        });
        // Execute a script in the console
        const script = () => {
            const tweets = document.querySelectorAll(".r-kzbkwu");
            let targetHref;

            if (tweets.length > 0) {
                targetHref = document.querySelectorAll(".r-kzbkwu")[0].querySelectorAll("a")[2].href
            }
            if (targetHref) {
                const litems = targetHref.split("/");
                return ({
                    tweetId: litems[litems.length - 1],
                    targetHref
                })
            }

            return false;
        };
        // Evaluate the script in the page's context
        const result = await page.evaluate(script);
        if (result) {
            console.log(`Found tweet: ${result.targetHref}`)
            tweets.push({ ...result, botId });
        }
        if (index < (usernames.length - 1)) {
            return getTweet(index + 1);
        } else {
            // Close the browser
            await browser.close();
            // save tweets to database
            console.log(`I was able to gather ${tweets.length} tweets!`);
            if (tweets.length === 0) return;
            await Tweet.insertMany(tweets);
            // update bot state
            await Bot.updateOne({ botId }, { stage: 3 });
            // like tweets
            likeTweets(botId);
        }
    }

    getTweet(0);

};


module.exports = getFirstTweets