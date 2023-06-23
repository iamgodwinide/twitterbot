const { model, Schema } = require("mongoose");

const AccountSchema = new Schema({
    AID: {
        type: Object,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    botId: {
        type: String,
        default: true
    }
});

module.exports = Account = model("Account", AccountSchema);