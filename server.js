const express = require("express");
const cors = require("cors");
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

// URLS
app.use("/api", require("./routes/index"));


app.listen(PORT, () => console.log(`server started on port ${PORT}`));