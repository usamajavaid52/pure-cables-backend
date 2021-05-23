const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;


const Finance = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    detail: {
        type: String,
    },
    billNumber: {
        type: String,
    },
    ledgerId: {
        type: String
    },
    debit: { type: Number },
    credit: { type: Number },
    ledgerType: { type: String },
    date: { type: Date, default: Date.now() }

});

module.exports = mongoose.model("Finance", Finance);