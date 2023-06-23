const { model, Schema } = require("mongoose");

const SystemSchema = new Schema({
    rate: {
        type: String,
        required: true
    }
});

module.exports = System = model("System", SystemSchema);