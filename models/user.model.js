const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;


const User = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
    },
    access: {
        type: String,
    },
    password: { type: String },
    date_added: { type: Date, default: Date.now() }

});

module.exports = mongoose.model("User", User);