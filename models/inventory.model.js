const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;


const Inventory = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    productName: {
        type: String,
    },
    weight: {
        type: Number,
    },
    purchaseId: { type: String },
    date: { type: Date, default: Date.now() }

});

module.exports = mongoose.model("Inventory", Inventory);