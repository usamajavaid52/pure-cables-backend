const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;


const Assets = new Schema({
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
    grossWeight: {
        type: String,
    },
    bardanaWeight: { type: String },
    netWeight: { type: String },
    billetWeight: { type: String },
    safiWeight: { type: String },
    waste: { type: Number },
    date: { type: Date, default: Date.now() }

});

module.exports = mongoose.model("Assets", Assets);