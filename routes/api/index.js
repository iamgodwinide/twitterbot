const getFollowers = require("../../bots/app");
const Account = require("../../model/Account");
const Bot = require("../../model/Bot");
const Tweet = require("../../model/Tweet");
const router = require("express").Router();

// create bot
router.post("/bots", async (req, res) => {
    try {
        const { name, targetFollowers, targetAccountID } = req.body;
        if (!name) {
            return res.json({
                success: false,
                msg: "Please provide a bot name"
            })
        }
        const newBot = new Bot({
            name,
            targetAccountID,
            targetFollowers,
            isRunning: false,
            stage: 1
        });
        await newBot.save();
        return res.json({
            success: true,
            msg: "Bot created successfully"
        });
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
});

// get bots
router.get("/bots", async (req, res) => {
    try {
        const bots = await Bot.find();
        return res.json({
            success: true,
            bots
        })
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
})

// edit bot

// startbot

// steps
// gather followers
// gather tweets
// like tweets
router.post("/start-bot", async (req, res) => {
    try {
        const { botId } = req.body;
        const bot = await Bot.findOne({ _id: botId });
        if (!bot) {
            return res.json({
                success: false,
                msg: "Invalid bot id"
            })
        }
        // if (bot.isRunning) {
        //     return res.json({
        //         success: false,
        //         msg: "Bot is already running"
        //     })
        // }
        // gather followers
        getFollowers(bot.targetAccountID, bot.targetFollowers, botId);
        await bot.updateOne({
            isRunning: true,
            initialized: true
        });
        return res.json({
            success: true,
            msg: "Bolt initialized"
        });
    } catch (err) {
        console.log(err);
    }
});

// delete bot

// add account
router.post("/add-account", async (req, res) => {
    try {
        const { accounts, botId } = req.body;
        if (!accounts || !botId) {
            return res.json({
                success: false,
                msg: "Please provide a bot ID and deatils"
            });
        }
        const _accounts = accounts.map(acc => ({ ...acc, AID: acc.id, botId }));
        await Account.insertMany(_accounts);
        return res.json({
            success: true,
            msg: "account added successfully"
        })
    } catch (err) {
        console.log(err);
    }
});

// get accounts 
router.get("/accounts/:botId", async (req, res) => {
    try {
        const { botId } = req.params;
        const accounts = await Account.find({ botId });
        return res.json({
            success: true,
            accounts
        })
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            msg: "Internal server error"
        })
    }
})

// like account
router.post("/like", async (req, res) => {
    try {
        const { tweetId } = req.body;
        if (!tweetId) {
            return res.json({
                success: false,
                msg: "Please provide an tweet ID"
            });
        }
        await Tweet.updateOne({
            tweetId: tweetId
        }, {
            liked: true
        });
        return res.json({
            success: true,
            msg: "Tweet liked successfully"
        })
    } catch (err) {
        console.log(err);
    }
});

// delete accounts
router.post("/delete-accounts", async (req, res) => {
    try {
        await Account.deleteMany({});
        await Tweet.deleteMany({});
        // await Bot.deleteMany({})
        return res.json({
            success: true,
            msg: "Accounts deleted successfully"
        })
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;