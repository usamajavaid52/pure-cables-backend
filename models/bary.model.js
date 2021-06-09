const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;


const Bary = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    millingId: {
        type: String
    },
    unit: {
        type: Number,
    },
    saryaWeight: {
        type: Number,
    },
    number8: {
        type: Number,
    },
    track: {
        type: Array,
    },
    charges: { type: Number },
    remaining: { type: Number },
    scrap: { type: Number },
    date: { type: Date, default: Date.now() }

});

module.exports = mongoose.model("Bary", Bary);