const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;


const Ledger = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    partyName: {
        type: String,
    },
    productName: {
        type: String,
    },
    billNumber: {
        type: String,
    },
    weight: {
        type: Number,
    },
    bardanaWeight: { type: Number },
    saafi: { type: Number },
    rate: { type: Number },
    totalPrice: { type: Number },
    debit: { type: Number },
    credit: { type: Number },
    balance: { type: Number },
    ledgerType: { type: String },
    date: { type: Date, default: Date.now() }

});

module.exports = mongoose.model("Ledger", Ledger);