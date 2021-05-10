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
    billNumber: {
        type: String,
    },
    debit: {
        type: String,
    },
    credit: { type: String },
    balance: { type: String },
    dc: { type: String },
    date: { type: Date, default: Date.now() }

});

module.exports = mongoose.model("Inventory", Inventory);