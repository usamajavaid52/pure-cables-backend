const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;


const Milling = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    product: {
        type: String
    },
    unit: {
        type: Number,
    },
    billetWeight: {
        type: Number,
    },
    saryaWeight: {
        type: Number,
    },
    kaatper100kg: {
        type: Number,
    },
    kaat: {
        type: Number,
    },
    stockReference: { type: Object },
    netWeight: { type: Number },
    scrap: { type: Number },
    date: { type: Date, default: Date.now() }

});

module.exports = mongoose.model("Milling", Milling);