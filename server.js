const express = require("express");
const cors = require("cors");
const Bot = require("./model/Bot");
const getFollowers = require("./bots/app");
const app = express();

// CONFIGS
require("dotenv").config();
require("./config/db")();
// MIDDLEWARES
app.use(cors());
app.use(express.static('./public'))
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


// Global variables
// app.use(function (req, res, next) {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });

const PORT = process.env.PORT || 2022;

// Start Bot operations
const startBot = async () => {
    const botDetails = {
        name: "test",
        targetFollowers: process.env.TargetFollowers,
        targetAccountID: process.env.TargetAccountID
    };
    const newBot = new Bot(botDetails);
    const bot = await newBot.save();
    getFollowers(bot.targetAccountID, bot.targetFollowers, bot.id);
}

startBot();

// URLS
app.use("/api", require("./routes/api"));
app.use("/api/auth", require("./routes/api/auth"));

app.listen(PORT, () => console.log(`server started on port ${PORT}`));